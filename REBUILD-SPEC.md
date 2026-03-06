# Mission Control v3 — Fortune 500 Rebuild

## Design Philosophy
Build this like you're shipping to a Fortune 500 executive team. No emojis anywhere in the UI. Clean, minimal, professional. Inspired by Linear, 1code.dev (21st.dev), and enterprise SaaS dashboards.

## Design System

### Colors
- Background: `#09090B` (zinc-950, near-black)
- Surface 1: `#18181B` (zinc-900, cards)
- Surface 2: `#27272A` (zinc-800, hover states)
- Surface 3: `#3F3F46` (zinc-700, borders)
- Border: `rgba(255,255,255,0.06)`
- Border hover: `rgba(255,255,255,0.12)`
- Text: `#FAFAFA` (zinc-50)
- Text secondary: `#A1A1AA` (zinc-400)  
- Text muted: `#71717A` (zinc-500)
- Accent: `#8B5CF6` (violet-500)
- Success: `#22C55E` (green-500)
- Warning: `#F59E0B` (amber-500)
- Danger: `#EF4444` (red-500)
- Info: `#3B82F6` (blue-500)

### Typography
- Font: Inter (Google Fonts)
- Monospace: JetBrains Mono (for numbers, timestamps, code)
- H1: 24px, weight 600, tracking -0.025em
- H2: 18px, weight 600
- H3: 15px, weight 500
- Body: 14px, weight 400
- Small: 12px, weight 400
- Tiny: 11px, weight 400

### Components
- Cards: bg zinc-900, border 1px rgba(255,255,255,0.06), radius 8px, NO shadows
- Buttons: radius 6px, height 32px, font 13px weight 500
- Primary button: bg violet-500, hover violet-600
- Secondary button: bg zinc-800, border zinc-700, hover zinc-700
- Badges: radius 4px, padding 2px 8px, font 11px weight 500
- Inputs: bg zinc-900, border zinc-700, focus border violet-500, radius 6px
- Tables: no outer border, subtle row dividers at rgba(255,255,255,0.04)

### Icons
Use Lucide icons via CDN (https://unpkg.com/lucide@latest/dist/umd/lucide.min.js)
NO emojis. All icons are SVG/Lucide.

## Layout (unchanged)
```
Top Bar (48px) — full width
├── Sidebar (200px) — fixed left
├── Main Content (fluid) — scrollable
└── Activity Panel (260px) — right, collapsible
```

## Top Bar (48px)
- Left: Small diamond/grid icon (Lucide "layout-grid") + "Mission Control" text (15px, weight 600, zinc-50)
- Center-right: Search bar — FULLY FUNCTIONAL
  - Click to open search modal overlay (centered, 480px wide)
  - Modal: input field with focus, search across tasks/docs/projects/memory
  - Results grouped by type with keyboard navigation
  - Cmd+K keyboard shortcut to open
- Right: Clock (JetBrains Mono, 13px, zinc-400, live PST), Settings gear icon (opens settings panel)
- Settings panel: slide-in from right, shows system info, toggle dark/light (dark only for now), activity panel toggle

## Sidebar (200px)
Replace emojis with Lucide icons:
1. layout-dashboard → Dashboard
2. check-square → Tasks
3. bot → Agents
4. calendar → Calendar
5. folder → Projects
6. brain → Memory
7. file-text → Docs
8. users → Team
9. settings → System

- Item height: 36px, font 13px weight 500
- Active: bg zinc-800/50, text zinc-50, left border 2px violet-500
- Hover: bg zinc-800/30
- Bottom: Avatar circle "NL" (zinc-800 bg, zinc-400 text, 28px), "Nhat Le" text 12px

## FUNCTIONAL REQUIREMENTS — ALL BUTTONS MUST WORK

### "+ New Task" button (Tasks page)
When clicked:
- Opens a modal overlay
- Fields: Title (text input), Description (textarea), Priority (dropdown: urgent/high/medium/low), Assignee (dropdown: Alfred/Nhat), Project (dropdown from projects list), Status (dropdown: backlog/inProgress/review/done)
- "Create" button saves to local state and re-renders kanban
- "Cancel" closes modal
- Data persists in memory until page reload (we can't write to JSON from client-side)

### Search bar (Top bar)
- Clickable input that opens a command palette modal
- Search across: tasks (by title), documents (by name/content), projects (by name), memory files
- Results shown in groups with icons
- Click result navigates to that page and highlights/selects the item
- Keyboard: arrow keys to navigate, Enter to select, Esc to close

### Settings icon (Top bar)
- Opens a slide-out panel from the right
- Shows: System info (model, container, OS, version), Activity panel toggle, Theme info
- Close button

### Task filter buttons
- "All", "Alfred", "Nhat" — toggle active state, filter kanban cards
- Active button: bg zinc-800, text white
- Inactive: text zinc-500

### Task cards — clickable
- Click opens detail modal showing full task info
- Modal: title, full description, status, priority, assignee, project, timestamps
- "Move to..." dropdown to change status
- Close button

### Document selection (Docs page)
- Click doc in list → shows in preview pane
- Tag chips are toggleable filters
- Search input filters in real-time

### Memory file selection
- Click file in list → shows rendered content
- Tab switching between Daily/Long-term works

## Page: Calendar (MUST match reference screenshots)
Full calendar week view:
- Header row: Mon | Tue | Wed | Thu | Fri | Sat | Sun with dates
- Today's column has subtle highlight (violet-500/5 bg)
- Time column on left: 12AM through 11PM (every hour)
- Grid lines: horizontal for hours, vertical for days
- Cron jobs rendered as colored blocks positioned at their scheduled times:
  - Blue blocks: briefings/standups
  - Violet blocks: strategy sessions  
  - Amber blocks: content tasks
  - Zinc blocks: system/maintenance
- Each block shows: job name, time
- Current time: red horizontal line spanning today's column
- Block height proportional to duration (default 1 hour)
- Below the week view: simple list of all cron jobs as a table

## Page: Dashboard
- Stats row: large numbers in JetBrains Mono
- Revenue tracker: clean progress bars with exact dollar amounts
- No emojis — use colored dots or Lucide icons for revenue streams
- Schedule: clean list with time, name, status dot
- Sprint: 6 cards in a row

## Page: Tasks (Kanban)
- 4 columns with count badges
- Cards with priority indicator (left border color), title, description, metadata
- Drag and drop NOT required (too complex for v3, add later)
- But all cards clickable for detail view

## Page: Agents
- Clean cards with left border color accent
- Status indicators: filled green circle (active), hollow gray circle (idle)
- No emojis — use Lucide icons (search, code, pen-line, trending-up, shield)

## Page: Projects  
- 2x3 grid of project cards
- Progress bars with percentage labels
- Status badges: subtle colored backgrounds
- Expandable details section

## Page: Memory
- Split view: file list left, content right
- Markdown renderer for content
- Toggle tabs for daily vs long-term

## Page: Docs
- Three-panel: filters left, list center, preview right
- Category badges with subtle colors (not bright)
- Search that actually filters in real-time

## Page: Team
- Mission statement banner (subtle gradient border, not loud)
- Org chart with clean cards connected by thin lines
- Skill badges with muted colors
- No emojis — use Lucide icons for each agent role

## Page: System
- Integration cards in grid
- Status indicators (green/amber/red dots, not emojis)
- Cron jobs table
- System info panel

## Activity Panel (right side)
- Header: "Activity" (not "Live Activity" with sparkles)
- Clean feed items with agent name, action, relative timestamp
- Agent names colored by their accent color

## Quality Checklist
- [ ] No emojis anywhere in the UI
- [ ] All buttons functional (new task, search, settings, filters, card clicks)
- [ ] Search modal with Cmd+K support
- [ ] Calendar shows week view with time grid and positioned blocks
- [ ] JetBrains Mono for all numbers and timestamps
- [ ] Lucide icons throughout
- [ ] Smooth transitions (150ms ease)
- [ ] Responsive — sidebar collapses on mobile
- [ ] All data from dashboard-data.json
- [ ] Auto-refresh every 60 seconds
- [ ] Professional enough for Fortune 500 board presentation
