// Vercel serverless function — syncs tasks to dashboard-data.json via GitHub API
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL;
const REPO = 'GFREQALFRED/alfred-dashboard';
const FILE_PATH = 'dashboard-data.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GitHub token not configured' });

  try {
    const { task } = req.body;
    if (!task || !task.title) return res.status(400).json({ error: 'Task title required' });

    // Get current file from GitHub
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    const fileData = await fileRes.json();
    const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf8'));

    // Add new task with guaranteed fields
    content.tasks.push({
      id: 't' + Date.now(),
      title: task.title || 'Untitled',
      description: task.description || '',
      status: task.status || 'backlog',
      priority: task.priority || 'medium',
      assignee: task.assignee || 'alfred',
      project: task.project || 'General',
      projectColor: task.projectColor || '#8B5CF6',
      createdAt: new Date().toISOString(),
      source: 'ui'
    });
    content.lastUpdated = new Date().toISOString();

    // Commit back to GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({
        message: `Task added: ${task.title}`,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha: fileData.sha
      })
    });

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return res.status(500).json({ error: 'GitHub update failed', detail: err });
    }

    const createdTask = content.tasks[content.tasks.length - 1];

    // Fire webhook to notify Alfred (OpenClaw) of the new task
    if (OPENCLAW_WEBHOOK_URL) {
      try {
        await fetch(OPENCLAW_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'alfred-dashboard',
            event: 'task_created',
            task: createdTask,
            previousStatus: null,
            newStatus: createdTask.status,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookErr) {
        console.error('Failed to forward to OpenClaw webhook:', webhookErr.message);
      }
    }

    return res.status(200).json({ success: true, taskId: createdTask.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
