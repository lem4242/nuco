---
description: List the current project's tables, or dump one table's rows
argument-hint: "[table]"
---

The user invoked nuco db with argument: `$ARGUMENTS`

Use the **nuco** skill (load it if it isn't already). No argument → list the current project's
tables (`nuco_context(project=…)`); a table name → dump its rows (`db_read(project, sql)` + `db_describe(project, table)`). Render per the
skill's **Rendering** spec (the Tables list + table-view rules, including hiding `doc`/`nuco_audit`).
Wake the breadcrumb heartbeat exactly as `/nuco` does. Markdown, never a widget.
