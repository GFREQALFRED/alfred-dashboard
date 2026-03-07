# AGENTS.md — Alfred Dashboard

Single-file SPA. JSON-driven. Dark theme default.

## Workflow
Every task follows: research → plan → implement. No skipping.
- **Research**: read this file, `grep` codebase for patterns, check `tasks/` for prior work. Output: `tasks/<task-slug>/research.md`.
- **Plan**: read research.md, design implementation (what/where/how/edge cases/mobile). Output: `tasks/<task-slug>/plan.md`.
- **Implement**: read plan.md, create todo list, execute. Branch, never master. Commit frequently. Group questions for the end.

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

## Document Schema (CRITICAL — breaks docs page if wrong)
When adding to the `documents` array in dashboard-data.json, EVERY doc must have:
```json
{"name": "Title Here", "path": "unique-slug", "category": "Category", "size": 1234, "words": 200, "content": "full content..."}
```
- `name` and `path` are REQUIRED. Not `title`, not `id`. The renderer uses `doc.name` and `doc.path`.
- `category` must match existing categories or be new.
- `words` = word count of content.
- `size` = character count of content.

## Git
- Work on branches, not master.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `style:`.
- Keep commits atomic and focused.

## Known Patterns
- Expandable cards: use `Set()` for tracking multiple expanded items.
- Hash parsing: split on `:` for sub-routes (e.g. `#tasks:nhat`).
- Dynamic progress: calculate from actual task completion, not hardcoded.
- Stat cards: clickable with filtered task lists, chevron indicators.

## QA (every change, no exceptions)
- After implementing, verify BEFORE committing:
  1. Open `index.html` in browser (or use screenshot tool if available)
  2. Check every affected page at desktop (1440px) AND mobile (390px)
  3. Ask yourself: "What looks wrong?" — alignment, spacing, clipping, overflow, missing data, broken layout
  4. Refresh the page — does hash routing survive? Does state persist?
  5. Check browser console for JS errors
  6. `grep` for every element you changed — does it appear in other render functions? Change ALL instances.
  7. If you changed a card/component template, check ALL pages that render similar components
  8. Fix everything found, re-verify, loop until clean
- Common gotchas:
  - Hash parsing: `#tasks:nhat` splits on `:` — don't break this
  - Sidebar collapse state uses localStorage — test collapse + refresh
  - Grid layouts: `align-items: start` prevents row stretching
  - Time format: always 12-hour AM/PM, never military
  - Mobile: check text doesn't overflow, buttons are tappable, tables scroll horizontally
- Only commit when you cannot find a single issue.
