# Mission Control Build Prompt

You are building a Mission Control dashboard — a single-page application (SPA) in ONE `index.html` file with inline CSS/JS. It reads all data from `dashboard-data.json` and auto-refreshes every 60 seconds.

## Tech Stack
- Single `index.html` — NO frameworks, NO build step
- Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
- Google Fonts: Inter
- Vanilla JavaScript for all interactivity
- Data from `dashboard-data.json` fetched via fetch()

## Design System
- **Font:** Inter
- **Background:** `#0F0F1A` (very dark, slight blue/purple undertone)
- **Card bg:** `#1A1A2E`
- **Card hover/active:** `#242440`
- **Sidebar bg:** same as background
- **Sidebar active item:** `#1E1E35` with left border accent
- **Borders:** `rgba(255,255,255,0.06)`
- **Text primary:** `#F0F0F0`
- **Text secondary:** `#8B8BA0`
- **Text muted:** `#555570`
- **Accent purple:** `#8B5CF6`
- **Green:** `#22C55E`
- **Orange:** `#F59E0B`
- **Red:** `#EF4444`
- **Blue:** `#6366F1`
- **Pink:** `#EC4899`
- **Teal:** `#14B8A6`
- Style inspiration: Linear app — clean, minimal, dark, professional

## Layout
```
┌─────────────────────────────────────────────────┐
│  Top Bar (52px)                                  │
├────────┬───────────────────────────┬─────────────┤
│Sidebar │  Main Content             │ Live Panel  │
│(200px) │  (fluid)                  │ (280px)     │
│        │                           │ collapsible │
└────────┴───────────────────────────┴─────────────┘
```

## Top Bar
- Left: "🎩" emoji + "Mission Control" (white, 17px, weight 600)
- Center-right: Search input (pill shape, dark bg, placeholder "Search... ⌘K")
- Right: Current time in PST (updates every second), settings gear icon
- Height: 52px, bottom border 1px rgba(255,255,255,0.06)

## Sidebar (200px fixed)
Navigation items with icons (use emoji as icons for simplicity):
1. 📊 Dashboard
2. ✅ Tasks  
3. 🤖 Agents
4. 📅 Calendar
5. 📁 Projects
6. 🧠 Memory
7. 📚 Docs
8. 👥 Team
9. ⚙️ System

- Each item: 38px height, 14px text, icon + label
- Active: lighter bg `#1E1E35`, white text, 3px left purple border
- Hover: subtle bg lighten
- Bottom of sidebar: Circle avatar with "N" (Nhat's initial), 32px

## Page: Dashboard (Home)
The overview page. Shows:

### Stats Row (top)
Large numbers with labels beside them:
- Tasks this week (green number)
- In progress (purple number)  
- Total tasks (white number)
- Completion % (green number)

### Revenue Tracker
- Header: "$1,000,000 Goal" with "by March 2027" subtitle
- Days remaining counter
- Overall progress bar (gradient green)
- 6 revenue stream cards in 2x3 grid:
  - GFREQ 💹 (target $160K)
  - Agents425 🤖 (target $200K)
  - E-commerce 🛒 (target $200K)
  - Mobile Apps 📱 (target $150K)
  - OpenClaw Deploy 🐾 (target $150K)
  - Beauty Salons 💄 (target $140K)
- Each card: name, current $, target $, progress bar, percentage

### Today's Schedule
- List of scheduled items with times
- PST time-based highlighting:
  - Past: opacity 0.4
  - Current (within 1 hour): bright, pulse glow animation
  - Upcoming: normal opacity
- Items from `schedule` array in JSON

### Sprint Timeline
- 6 boxes in a row, each representing a week
- Current week highlighted with purple border + glow
- Week label + date range + focus area

## Page: Tasks (Kanban Board)
### Stats bar at top
- This week count (green), In progress (purple), Total (white), Completion % (green)

### Filter bar
- "+ New task" button (green bg, white text)
- Filter by assignee: "Alfred", "Nhat", "All"
- Project dropdown filter

### Kanban columns
4 columns: Backlog | In Progress | Review | Done
- Column header: colored dot + name + count + "+" button
- Dot colors: gray, purple, orange, green
- Cards:
  - Priority dot (left edge): red=urgent, orange=medium, green=low, gray=none
  - Title: 14px, semibold, white
  - Description: 13px, muted, 2-line clamp
  - Bottom: assignee avatar (A=Alfred purple, N=Nhat green) + project tag (color-coded) + relative timestamp
- Cards are draggable (implement basic drag-and-drop)

## Page: Agents
Shows sub-agent activity:
- Agent cards in a list
- Each card: agent name (color-coded), current task, status badge, start time
- Status: 🟢 Running (green pulse), ✅ Completed, ❌ Failed, ⏸ Idle
- Agents: Research Agent (blue), Coding Agent (green), Content Agent (orange), SEO Agent (purple)
- Show recent completed tasks below active ones

## Page: Calendar
- Week view showing all cron jobs as blocks
- Days across top (Mon-Sun)
- Time slots down the left (6AM - 11PM PST)
- Color-coded by type:
  - Briefings/standups: blue
  - Strategy: purple
  - Content: orange
  - System: gray
- Current time indicator (red horizontal line)
- Today column highlighted
- Click a block to see details

## Page: Projects
6 business cards in a 2x3 grid:
- Each card:
  - Icon + Name (large, bold)
  - Status badge (Active/Planning/Not Started)
  - Phase label
  - Description (2-3 lines)
  - Progress bar with percentage
  - Key metrics/stats below
  - "View Details" expandable section with sub-tasks
- Color-coded borders by status:
  - Active: green left border
  - Planning: yellow left border  
  - Not Started: gray left border

## Page: Memory
Memory file browser:
- Left panel: List of memory files by date (newest first)
  - Each entry: date, day of week, preview text
  - Active file highlighted
- Right panel: Rendered content of selected file
  - Basic markdown rendering (headers → h1-h3, **bold**, *italic*, - lists, `code`, links)
  - File metadata: name, size, word count
- Top: Toggle between "Daily Notes" and "Long-term Memory" (MEMORY.md)
- Search bar to filter/search across all memories

## Page: Docs
Document browser (mimics the reference screenshot closely):
- Left panel (~40% width):
  - Search bar: "Search documents..." with magnifying glass
  - Tag filter chips: colored badges for each project category
    - GFREQ (red), Personal (blue), Salon (teal), E-commerce (orange), Agents425 (purple), OpenClaw (green), Other (gray)
  - File type filter: .md badges
  - Document list: scrollable, each entry shows file icon + filename + tag badge
  - Selected doc highlighted
- Right panel (~60% width):
  - Header: filename, tag badge, "X KB • Y words"
  - Rendered markdown content (same renderer as Memory page)
  - Scrollable

## Page: Team  
Agent org chart:

### Mission Statement Banner
Blue/teal gradient banner at top:
> "Build an empire of 6 revenue streams generating $1,000,000 by March 2027, powered by AI agents that work 24/7"

### Title: "Meet the Team"
Subtitle: "AI agents working around the clock, each with a real role"

### Org Chart
Hierarchical layout with connecting lines:

**Alfred 🎩** — Chief of Staff / CEO
- "Coordinates, delegates, and drives the $1M mission. The brain behind the operation."
- Skills: `Orchestration` `Strategy` `Delegation`
- Gold/yellow border

Line down to:

**Operations Layer:**
Two cards side by side:
- **Research Agent 🔍** — Trend Analyst
  - "Finds leads, tracks signals, analyzes markets"
  - Skills: `Speed` `Analysis` `Thoroughness`
  - Blue border
- **Coding Agent 💻** — Lead Engineer  
  - "Builds, ships, automates. Makes everything actually work."
  - Skills: `Code` `Systems` `Frontend`
  - Green border

Line down to:

**Output Layer:**
Two cards side by side:
- **Content Agent ✍️** — Content Writer
  - "Writes copy, designs content strategy, builds the brand voice"
  - Skills: `Voice` `Quality` `SEO`
  - Orange border
- **SEO Agent 📈** — Growth Specialist
  - "Keywords, rankings, LLM optimization, traffic growth"
  - Skills: `Keywords` `Rankings` `Growth`
  - Purple border

### Agent cards:
- Each has icon/emoji avatar, name, role title
- Description text
- Skill badges (colored to match card border)
- "ROLE CARD →" link

## Page: System
Integration & system health:

### Integrations Grid (3 columns)
Each integration card:
- Icon + Name
- Detail (username/email)
- Status badge: ✅ Active (green), ⏳ Pending (yellow), ❌ Inactive (red)

### Cron Jobs Table
- Columns: Name, Schedule, Last Run, Next Run, Status
- Sortable
- Status: Active (green dot), Paused (yellow dot), Failed (red dot)
- Show all cron jobs from JSON

### System Stats
- Model: Claude Opus 4.6
- Uptime
- Container info
- Last deployment

## Right Panel: Live Activity
- Header: "✨ Live Activity"
- Vertical feed of events
- Each event: agent name (colored) + action text + relative timestamp
- Agent colors: Alfred=purple, Research=blue, Coding=green, Content=orange, SEO=pink
- If empty: "No recent activity" with muted text
- Collapsible via toggle button

## Global Features
- SPA routing: sidebar clicks show/hide page divs (no page reload)
- Active page stored in URL hash (#dashboard, #tasks, etc.)
- Auto-refresh JSON every 60 seconds
- All times displayed in PST (America/Los_Angeles)
- Smooth fade transitions between pages
- Mobile responsive: sidebar collapses to hamburger menu on mobile
- Search (⌘K): global search modal that searches across tasks, docs, memory, projects
- Relative timestamps ("2 minutes ago", "yesterday")

## IMPORTANT RULES
1. ALL data comes from dashboard-data.json — no hardcoded content
2. The HTML must be a SINGLE file — all CSS and JS inline
3. Use Tailwind utility classes for styling
4. Custom CSS only for animations (pulse, fade) and the markdown renderer
5. The design must look like Linear — clean, minimal, professional
6. Mobile responsive
7. NO external JS libraries except Tailwind CDN
8. Every section must handle empty/missing data gracefully
