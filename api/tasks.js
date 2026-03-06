// Vercel serverless function — syncs tasks to dashboard-data.json via GitHub API
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL;
const REPO = 'GFREQALFRED/alfred-dashboard';
const FILE_PATH = 'dashboard-data.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GitHub token not configured' });

  try {
    // GET: Return current tasks from dashboard-data.json
    if (req.method === 'GET') {
      const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: { 
          'Authorization': `Bearer ${GITHUB_TOKEN}`, 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'alfred-dashboard'
        }
      });
      
      if (!fileRes.ok) {
        return res.status(500).json({ error: 'Failed to fetch data from GitHub' });
      }
      
      const fileData = await fileRes.json();
      const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf8'));
      
      return res.status(200).json({ 
        success: true, 
        tasks: content.tasks || [],
        lastUpdated: content.lastUpdated 
      });
    }

    // PATCH: Update specific task fields only
    if (req.method === 'PATCH') {
      const { id, updates } = req.body;
      if (!id || !updates) {
        return res.status(400).json({ error: 'Task ID and updates object required' });
      }

      // Get current file from GitHub
      const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: { 
          'Authorization': `Bearer ${GITHUB_TOKEN}`, 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'alfred-dashboard'
        }
      });
      
      if (!fileRes.ok) {
        return res.status(500).json({ error: 'Failed to fetch current data from GitHub' });
      }
      
      const fileData = await fileRes.json();
      const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf8'));

      // Find and update ONLY the specified task
      const taskIndex = content.tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const previousTask = { ...content.tasks[taskIndex] };
      
      // Apply updates surgically - only update provided fields
      Object.keys(updates).forEach(key => {
        content.tasks[taskIndex][key] = updates[key];
      });

      // Add completion timestamp if moving to done
      if (updates.status === 'done' && !content.tasks[taskIndex].completedAt) {
        content.tasks[taskIndex].completedAt = new Date().toISOString();
      }

      // Update metadata
      content.lastUpdated = new Date().toISOString();

      // Commit back to GitHub with surgical precision
      const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${GITHUB_TOKEN}`, 
          'Content-Type': 'application/json', 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'alfred-dashboard'
        },
        body: JSON.stringify({
          message: `Update task: ${content.tasks[taskIndex].title} (${Object.keys(updates).join(', ')})`,
          content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
          sha: fileData.sha
        })
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();
        return res.status(500).json({ error: 'GitHub update failed', detail: err });
      }

      const updatedTask = content.tasks[taskIndex];

      // Fire webhook to notify Alfred (OpenClaw) of the task update
      if (OPENCLAW_WEBHOOK_URL) {
        try {
          await fetch(OPENCLAW_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: 'alfred-dashboard',
              event: 'task_updated',
              task: updatedTask,
              previousStatus: previousTask.status,
              newStatus: updatedTask.status,
              changes: updates,
              timestamp: new Date().toISOString()
            })
          });
        } catch (webhookErr) {
          console.error('Failed to forward to OpenClaw webhook:', webhookErr.message);
        }
      }

      return res.status(200).json({ 
        success: true, 
        task: updatedTask,
        changes: updates
      });
    }

    // POST: Create new task
    if (req.method === 'POST') {
      const { task } = req.body;
      if (!task || !task.title) {
        return res.status(400).json({ error: 'Task title required' });
      }

      // Get current file from GitHub
      const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: { 
          'Authorization': `Bearer ${GITHUB_TOKEN}`, 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'alfred-dashboard'
        }
      });
      
      if (!fileRes.ok) {
        return res.status(500).json({ error: 'Failed to fetch current data from GitHub' });
      }
      
      const fileData = await fileRes.json();
      const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf8'));

      // Create new task with guaranteed fields
      const newTask = {
        id: task.id || 't' + Date.now(),
        title: task.title || 'Untitled',
        description: task.description || '',
        status: task.status || 'backlog',
        priority: task.priority || 'medium',
        assignee: task.assignee || 'alfred',
        project: task.project || 'General',
        projectColor: task.projectColor || '#8B5CF6',
        createdAt: new Date().toISOString(),
        source: task.source || 'ui'
      };

      // Add to tasks array, preserving ALL other data
      content.tasks.push(newTask);
      content.lastUpdated = new Date().toISOString();

      // Commit back to GitHub
      const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${GITHUB_TOKEN}`, 
          'Content-Type': 'application/json', 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'alfred-dashboard'
        },
        body: JSON.stringify({
          message: `Add task: ${newTask.title}`,
          content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
          sha: fileData.sha
        })
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();
        return res.status(500).json({ error: 'GitHub update failed', detail: err });
      }

      // Fire webhook to notify Alfred (OpenClaw) of the new task
      if (OPENCLAW_WEBHOOK_URL) {
        try {
          await fetch(OPENCLAW_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: 'alfred-dashboard',
              event: 'task_created',
              task: newTask,
              previousStatus: null,
              newStatus: newTask.status,
              timestamp: new Date().toISOString()
            })
          });
        } catch (webhookErr) {
          console.error('Failed to forward to OpenClaw webhook:', webhookErr.message);
        }
      }

      return res.status(200).json({ success: true, task: newTask });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}