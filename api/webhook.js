// Vercel serverless function — receives task webhook events and forwards to OpenClaw
const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { event, task, previousStatus, newStatus } = req.body;

    if (!event || !task) {
      return res.status(400).json({ error: 'Missing event or task in payload' });
    }

    // Forward to OpenClaw if webhook URL is configured
    if (OPENCLAW_WEBHOOK_URL) {
      try {
        await fetch(OPENCLAW_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'alfred-dashboard',
            event,
            task,
            previousStatus: previousStatus || null,
            newStatus: newStatus || task.status,
            timestamp: new Date().toISOString()
          })
        });
      } catch (forwardErr) {
        // Log but don't fail — OpenClaw being unreachable shouldn't break the dashboard
        console.error('Failed to forward webhook to OpenClaw:', forwardErr.message);
      }
    } else {
      console.warn('OPENCLAW_WEBHOOK_URL not set — webhook event logged but not forwarded');
    }

    return res.status(200).json({ success: true, event, taskId: task.id });
  } catch (e) {
    console.error('Webhook handler error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
