---
name: project
description: With no argument, list projects; with a project key, move the cursor into it and show its contents. Runs on `/nuco:project [name]`. Fast markdown — no widget.
---

# /nuco:project [name] — switch project / list projects

- **No argument** → same as the root list: call `nuco_context`, render the projects table, leave the cursor at root. Footer prompts `/nuco:project <name>`.
- **With a name** (`$ARGUMENTS`) → validate it against the keys from `nuco_context`; if it doesn't match, say so and show the list. Otherwise set the **cursor** to that project key and show its contents:
  - **tables** — the project's tables (`db_describe`, or a schema read), as `| table | columns | ~rows |`,
  - **docs** — `doc_search` scoped to the project (`active` first), a few most-relevant titles,
  - **files** — `file_list`.
  Render as a compact markdown summary; degrade gracefully for anything nuco doesn't return.
- Footer: `nuco > <project>` — `/nuco:db [t]` · `/nuco:assets` · `/nuco:search <q>`.
- Heartbeat: `— nuco > <project>`.

Markdown only — no `show_widget`.
