# Alfred's Command Center — Dashboard v2.0 Specification

## Architecture
- Single `index.html` + `dashboard-data.json`
- Client-side JavaScript reads JSON, renders everything
- Auto-refresh JSON every 60 seconds
- Tailwind CSS via CDN, dark mode fintech aesthetic
- Mobile-first responsive design
- Deployed on Vercel via GitHub (GFREQALFRED/alfred-dashboard)

## Revenue Tracker
- **Start from $0** (not $80K — that was historical)
- $1,000,000 target by March 2027
- Overall progress bar
- 6 revenue streams with individual bars:
  - GFREQ (💹) — target $160K
  - Agents425 (🤖) — target TBD
  - E-commerce (🛒) — target TBD
  - Mobile Apps (📱) — target TBD
  - OpenClaw Deploy (🐾) — target TBD
  - Beauty Salons (💄) — target TBD
- Show current $ and % for each

## Today's Schedule
- Show all daily scheduled items with times (PST)
- **Dynamic highlighting based on current PST time:**
  - Past items: dimmed/muted
  - Current/active item: bright highlight with pulse animation
  - Upcoming items: normal
- Items: Night Shift (12AM), Morning Standup (6AM), Morning Briefing (7AM), Market Intel (9AM), Midday Push (1PM), Evening Strategy (8PM), Daily Log (10PM)

## Integrations Grid
- Color-coded status:
  - ✅ Active = green
  - ⏳ Pending = yellow
  - ❌ Inactive = red
- Each shows name, detail/handle, and status
- Current: Gmail, GitHub, X, Google Calendar, Google Drive, Reddit, Discord Bot, Vercel

## Active Projects
- Cards with:
  - Project name
  - Current status text
  - Phase label
  - **Progress bar with percentage** (MUST show %)
  - Color-coded by status (active=green, planning=yellow, not started=gray)
- Projects: GFREQ Website, NinjaView Replacement, Content Machine, Course, Agents425, Salon Turnaround, Alfred Journal, Dashboard, **E-commerce** (MUST be included)

## Completed Tasks
- Separate section from Active Projects
- Shows recently completed tasks/milestones
- Auto-clear after 24 hours (use timestamp in JSON, JS hides old ones)
- Collapsed by default, expandable
- Shows completion timestamp

## Action Items for Nhat
- Checklist with done/not-done states
- Progress bar showing X/Y completed
- Completed items shown with strikethrough but still visible
- Grouped: Urgent (red), Normal, Done (muted)

## Sub-Agent Activity
- Show recent sub-agent runs
- Status: running (spinner), completed (✅), failed (❌)
- Each shows: agent type, task summary, status, timestamp
- Running agents at top, completed below

## Sprint Timeline
- 6-week visual timeline
- Current week highlighted
- Each week labeled with focus area
- Show start/end dates

## Documents Viewer
- Collapsible accordion by category
- Categories: GFREQ, Personal, Salon, E-commerce, Agents425, OpenClaw
- Each doc: title, click to expand, shows rendered markdown content
- Simple markdown rendering (headers, bold, lists, links, code blocks)
- Search/filter across all docs

## Header
- "Alfred's Command Center 🎩"
- Current PST date/time (auto-updating every second)
- "Last Updated" timestamp from JSON data
- Days remaining until $1M target date

## Footer
- Quick stats: total projects, completed tasks today, active agents
- Version number

## Design Principles
- Dark mode, fintech aesthetic
- Cards with subtle borders and shadows
- Progress bars with gradient fills
- Smooth animations on load and update
- Mobile-first — must look great on phone
- Clean typography, good spacing
- Status colors consistent throughout: green=good, yellow=pending, red=needs attention
