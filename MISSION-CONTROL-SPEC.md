# Alfred's Mission Control — Full Rebuild Specification

## Reference
Based on the Mission Control dashboard from YouTube video: https://www.youtube.com/watch?v=RhLpV6QDBFE
Reference screenshots saved at: /home/openclaw/.openclaw/workspace/projects/dashboard/reference/mc-1.png through mc-9.png

## Architecture
- Single `index.html` + `dashboard-data.json`
- Client-side JavaScript reads JSON, renders everything
- Auto-refresh JSON every 60 seconds
- Tailwind CSS via CDN
- Deployed on Vercel via GitHub (GFREQALFRED/alfred-dashboard)

## Global Design

### Colors
- Background: `#1A1A2E` (dark with subtle purple undertone, NOT pure black)
- Card background: `#242438` (slightly lighter)
- Sidebar active: `#2A2A40` (muted dark purple tint)
- Borders: `rgba(255,255,255,0.06)` (extremely subtle)
- Text primary: `#FFFFFF`
- Text secondary: `#8888A0`
- Text muted: `#666680`
- Accent purple: `#8B5CF6`
- Green: `#22C55E`
- Orange: `#F59E0B`
- Red: `#EF4444`
- Blue: `#6366F1`
- Pink: `#EC4899`

### Typography
- Font: Inter (Google Fonts CDN)
- Headers: 600 weight
- Body: 400 weight
- Stats numbers: 700 weight, 36-40px
- Nav items: 14-15px
- Card titles: 14-15px, 600 weight
- Descriptions: 13px, 400 weight

### Layout
- Fixed left sidebar (~200px)
- Main content area (fluid)
- Optional right panel for Live Activity (~260px)
- Fixed top nav bar (~52px)

## Top Navigation Bar
- Height: 52px
- Left: Sidebar toggle icon + "🎩" emoji + "Mission Control" text (white, 16-18px, weight 500)
- Right: Search bar (pill shape, `#2A2A3E` bg, "Search" text + "⌘K" badge), Pause button, settings gear icon
- Bottom border: 1px `rgba(255,255,255,0.06)`

## Left Sidebar (200px)
- Full height, same background
- Nav items: icon (18px, muted gray) + label (14px)
- Row height: 38px
- Active state: lighter bg `#2A2A40`, white text
- Hover: subtle highlight
- Navigation pages:
  1. 📊 Dashboard (home — revenue, schedule, overview)
  2. ✅ Tasks (kanban board)
  3. 🤖 Agents (sub-agent activity)
  4. 📄 Content (content pipeline)
  5. 📅 Calendar (schedule view)
  6. 📁 Projects (all 6 businesses)
  7. 🧠 Memory (memory files viewer)
  8. 📚 Docs (document browser with search, tags, preview)
  9. 👥 Team (agent org chart — Alfred's delegation structure)
  10. ⚙️ System (integrations status, cron jobs)
- Bottom: "N" avatar circle (Nhat's initial, 32px)
- Each page loads different content in the main area from the SAME JSON

## Page: Dashboard (Home)
Shows the overview — what was our original dashboard:
- $1M Revenue tracker (all streams starting at $0)
- Today's schedule with PST time highlighting (dim past, pulse current, normal upcoming)
- Sprint timeline (6 weeks, current highlighted)
- Quick stats row (tasks this week, in progress, completion %)
- Action items summary (urgent items only)

## Page: Tasks
Kanban-style board:
- Columns: Backlog, In Progress, Review, Done
- Status dots: gray, purple, orange, green
- Task cards with:
  - Priority dot (red=urgent, orange=medium, green=low)
  - Title (14px, semibold, white)
  - Description (13px, muted gray, 1-2 lines truncated)
  - Bottom row: project tag (color-coded) + timestamp
- "+ New task" button (green, top left)
- Stats bar: This week count, In progress count, Total, Completion %
- Pull tasks from `actionItems` and `projects` in JSON

## Page: Agents
Sub-agent monitor:
- Cards for each agent type (Research, Coding, Content, SEO)
- Status: running (spinner), completed (✅), failed (❌)
- Task summary, timestamp
- Running agents at top, completed below

## Page: Content
Content pipeline view:
- List of content pieces (blog posts, tweets, articles)
- Status: draft, scheduled, published
- Categories by platform (X, Reddit, Blog, Email)

## Page: Calendar
Schedule view:
- Daily schedule with all cron jobs
- Meetings highlighted differently from work blocks
- Current time indicator
- Weekly view showing sprint items

## Page: Projects
All 6 businesses as cards:
- GFREQ, Agents425, E-commerce, Mobile Apps, OpenClaw Deploy, Beauty Salons
- Each with: progress bar, status, phase, description
- Click to expand for more details

## Page: Memory
Memory file viewer:
- List of daily memory files (memory/YYYY-MM-DD.md)
- MEMORY.md long-term view
- Click to read rendered markdown

## Page: Docs
Document browser (like the reference screenshots):
- Left panel: search bar + tag filter chips + file list
- Right panel: document preview/reader
- Tags: by project (GFREQ, Personal, Salon, etc.)
- File type filters (.md)
- Shows filename, tag badge, file size
- Renders markdown content in preview

## Page: Team
Agent org chart:
- Alfred (🎩) at top — Chief of Staff / CEO
- Below: Agent types with descriptions and skill tags
  - Research Agent — skill tags: Speed, Analysis, Thoroughness
  - Coding Agent — skill tags: Code, Systems, Frontend
  - Content Agent — skill tags: Voice, Quality, SEO
  - SEO Agent — skill tags: Keywords, Rankings, LLM Optimization
- Each agent card has: avatar, role, description, colored skill badges, colored border
- Connected by vertical lines showing hierarchy

## Page: System
Integration and system health:
- All integrations with status (Gmail, GitHub, X, Calendar, etc.)
- Cron job list with last run times and next run
- Docker container health (disk, RAM)
- Model usage stats

## Right Panel: Live Activity
- Collapsible right panel (~260px)
- Shows real-time activity feed
- Agent name (color-coded) + action description + timestamp
- Auto-updates from JSON

## Completed Tasks
- Section in Tasks page
- Collapsed by default
- Auto-hides items older than 24h (JS timestamp check)
- Shows completion timestamp

## JSON Structure
The dashboard-data.json must include ALL data for ALL pages:
- revenue (streams, targets, current values — ALL starting at $0)
- schedule (daily items with times)
- integrations (name, detail, status)
- projects (name, status, phase, progress, description)
- actionItems (task, done, priority, category)
- completedTasks (task, completedAt timestamp)
- subagents (name, task, status, timestamp)
- sprint (weeks, current week, labels)
- documents (name, category, content — full markdown)
- contentPipeline (pieces with platform, status)
- cronJobs (name, schedule, lastRun, nextRun, status)
- systemHealth (disk, ram, uptime)
- team (agents with roles, descriptions, skills, colors)
- liveActivity (recent events with agent, action, timestamp)

## Key Differences from Reference
- Our branding: "🎩 Mission Control" not their logo
- Our agents: Alfred, Research Agent, Coding Agent, Content Agent, SEO Agent (not their team)
- Our projects: 6 businesses, not their content-focused setup
- No virtual office (skip this — too complex for v2, add later)
- Revenue tracker is unique to us
- Sprint timeline is unique to us

## Quality Requirements
- Mobile responsive (must work on phone)
- No bugs — test all JSON references
- Smooth animations (Tailwind transitions)
- Search functionality in Docs page
- All timestamps in PST
- Auto-refresh every 60 seconds
- Page navigation via sidebar (no page reload — SPA-style with JS show/hide)
