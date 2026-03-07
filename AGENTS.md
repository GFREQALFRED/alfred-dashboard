# AGENTS.md — Alfred Dashboard

Single-file SPA. JSON-driven. Dark theme default.

## Workflow
Every coding task follows this pipeline. No skipping steps.

### 1. Research
- Read this file and understand the architecture
- `grep` the codebase for existing patterns related to the task
- Check `tasks/` folder for prior research on similar work
- Output: `tasks/<task-slug>/research.md` — findings, existing patterns, relevant code snippets

### 2. Plan
- Read your research.md
- Design the implementation: what changes, where, how, edge cases, mobile
- Reuse existing patterns and code where possible
- Output: `tasks/<task-slug>/plan.md` — complete spec, step-by-step, no gaps

### 3. Implement
- Read your plan.md, create a todo list, execute
- Work on a new branch, never master
- Commit frequently with conventional commits
- If ambiguous, group questions for the end

## Architecture
- `index.html` — entire app (HTML + CSS + JS). No frameworks, no build step.
- `dashboard-data.json` — all data (tasks, projects, schedule, agents, docs, people, etc.)
- Client-side rendering: JS reads JSON, renders pages via `render<Page>()` functions.
- Page routing: URL hash (`#dashboard`, `#tasks`, `#calendar`, etc.)
- Renderer registry: `const renderers = { ... }` — add new pages here.

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
