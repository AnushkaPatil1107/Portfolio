// Vercel Serverless Function: public aggregate counter + private visit log.
// Required env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.
// Each new browser session is logged with its IP and coarse location headers, if available.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(503).json({ error: "Counter storage is not configured" });
  const redis = url.replace(/\/$/, "");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  try {
    if (req.query.new === "1") {
      const inc = await fetch(`${redis}/incr/player-one-portfolio-visits`, { headers, cache: "no-store" });
      if (!inc.ok) throw new Error("Counter increment failed");
      await inc.json();

      // Vercel provides these headers at the edge. Keep raw IPs in a capped, private Redis list.
      const forwarded = req.headers["x-forwarded-for"];
      const ip = String(req.headers["x-real-ip"] || (forwarded ? forwarded.split(",")[0].trim() : "unknown")).slice(0, 100);
      const entry = {
        timestamp: new Date().toISOString(),
        ip,
        country: String(req.headers["x-vercel-ip-country"] || "unknown").slice(0, 80),
        region: String(req.headers["x-vercel-ip-country-region"] || "unknown").slice(0, 100),
        city: String(req.headers["x-vercel-ip-city"] || "unknown").slice(0, 120),
      };
      const encoded = JSON.stringify(entry);
      // LPUSH then trim to 500 most recent entries to limit retention/storage.
      const push = await fetch(`${redis}/pipeline`, {
        method: "POST", headers, cache: "no-store",
        body: JSON.stringify([
          ["LPUSH", "player-one-private-visitor-log", encoded],
          ["LTRIM", "player-one-private-visitor-log", "0", "499"]
        ])
      });
      if (!push.ok) throw new Error("Visitor log write failed");
    }
    const response = await fetch(`${redis}/get/player-one-portfolio-visits`, { headers, cache: "no-store" });
    if (!response.ok) throw new Error("Counter read failed");
    const payload = await response.json();
    const visits = Number(payload.result || 0);
    return res.status(200).json({ visits: Number.isFinite(visits) ? visits : 0 });
  } catch (_) {
    return res.status(502).json({ error: "Counter service unavailable" });
  }
}
