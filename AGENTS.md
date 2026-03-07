# AGENTS.md — Alfred Dashboard

Single-file SPA. JSON-driven. Dark theme default.

## Architecture
- `index.html` — entire app (HTML + CSS + JS). No frameworks, no build step.
- `dashboard-data.json` — all data (tasks, projects, schedule, agents, docs, people, etc.)
- Client-side rendering: JS reads JSON, renders pages via `render<Page>()` functions.
- Page routing: URL hash (`#dashboard`, `#tasks`, `#calendar`, etc.)
- Renderer registry: `const renderers = { dashboard:renderDashboard, ... }` — add new pages here.

## Conventions
- CSS variables for theming: `var(--bg1)`, `var(--text1)`, `var(--accent)`, etc.
- Mobile breakpoint: 390px. All pages must work at this width.
- 12-hour time format (AM/PM). No military time.
- `align-items: start` on grids to prevent row height stretching.
- localStorage for client-side state (archive, sidebar collapse, etc.)
- Lucide icons via CDN. Use `data-lucide` attributes.

## Do NOT
- Touch `dashboard-data.json` task statuses. Alfred handles that.
- Create separate CSS/JS files. Everything stays in `index.html`.
- Use frameworks or build tools. Vanilla only.
- Change the dark theme defaults.
- Use markdown tables in any rendered content.

## Git
- Work on branches, not master.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `style:`.
- Keep commits atomic and focused.

## Known Patterns
- Expandable cards: use `Set()` for tracking multiple expanded items.
- Hash parsing: split on `:` for sub-routes (e.g. `#tasks:nhat`).
- Dynamic progress: calculate from actual task completion, not hardcoded.
- Stat cards: clickable with filtered task lists, chevron indicators.

## Testing
- Refresh every page after changes — hash routing can break silently.
- Check both desktop (1440px) and mobile (390px).
- Verify sidebar collapse/expand survives refresh.
