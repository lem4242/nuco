---
description: List the current project's tables, or dump one table's rows
argument-hint: "[table]"
---

The user invoked nuco db with argument: `$ARGUMENTS`

Use the **nuco** and **nuco-render** skills (load them if needed). No argument → list the current project's
tables (`nuco_context(project=…)`); a table name → dump its rows (`db_read(project, sql)` + `db_describe(project, table)`). Render per the
**nuco-render** screen rules (the Tables list + table-view rules, including hiding `doc`/`nuco_audit`).
Wake the breadcrumb heartbeat per **nuco-render**. Markdown, never a widget.
