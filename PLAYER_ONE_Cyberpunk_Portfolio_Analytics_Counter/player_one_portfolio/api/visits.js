// Vercel Serverless Function: aggregate portfolio session counter.
// Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.
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
  try {
    if (req.query.new === "1") {
      const inc = await fetch(`${url.replace(/\/$/, "")}/incr/player-one-portfolio-visits`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
      });
      if (!inc.ok) throw new Error("Counter increment failed");
      await inc.json();
    }
    const response = await fetch(`${url.replace(/\/$/, "")}/get/player-one-portfolio-visits`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
    });
    if (!response.ok) throw new Error("Counter read failed");
    const payload = await response.json();
    const visits = Number(payload.result || 0);
    return res.status(200).json({ visits: Number.isFinite(visits) ? visits : 0 });
  } catch (_) {
    return res.status(502).json({ error: "Counter service unavailable" });
  }
}
