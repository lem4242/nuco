---
name: db
description: With no argument, list the tables in the current project; with a table name, dump its rows. Runs on `/nuco:db [table]`. Fast markdown — no widget.
---

# /nuco:db [table] — tables in the current project

Operates on the **cursor's project** (set by `/nuco:start` or `/nuco:project`; default = home). State which project in the output.

- **No argument** → list that project's tables (`db_describe`, or read the schema). Render `| table | columns | ~rows |`. Footer: "▸ `/nuco:db <table>` to open one".
- **With a table** (`$ARGUMENTS`) → `db_read` with `SELECT * FROM <project>.<table> LIMIT 25`. Render the rows as a markdown table. Show the row count and whether it was truncated.

Respect the core skill's SQL notes: numeric columns come back as **strings** (don't do math on them), reads cap at **500 rows**, and `where` filters take the `{col:v}` / `{col:[a,b]}` / `{col:{op,value}}` shapes.

- Footer: `nuco > <project> > db[ > <table>]`.
- Heartbeat: `— nuco > <project>[ > <table>]`.

Markdown only — no `show_widget`.
