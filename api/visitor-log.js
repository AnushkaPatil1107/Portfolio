// Owner-only endpoint. Set VISITOR_LOG_SECRET in Vercel Environment Variables.
// Never expose the secret in a URL or commit it to source control.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Vary", "Authorization");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const expected = process.env.VISITOR_LOG_SECRET;
  if (!expected || !req.headers.authorization || req.headers.authorization !== `Bearer ${expected}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(503).json({ error: "Log storage is not configured" });
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/lrange/player-one-private-visitor-log/0/199`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
    });
    if (!response.ok) throw new Error("Log read failed");
    const payload = await response.json();
    const entries = Array.isArray(payload.result) ? payload.result.map(value => {
      try { return JSON.parse(value); } catch (_) { return null; }
    }).filter(Boolean) : [];
    return res.status(200).json({ entries });
  } catch (_) {
    return res.status(502).json({ error: "Unable to read visitor log" });
  }
}
