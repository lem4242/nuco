---
name: nuco-db
description: The current project's tables, or one table's rows. Runs on /nuco-db [table].
argument-hint: "[table]"
---
The **db** view. No argument → list the current project's tables. A table name → dump its rows.

Layout is owned entirely by the **`nuco`** skill's Rendering spec (its Tables list + table-view rules, incl. hiding `doc`/`nuco_audit`) — apply it (read the `nuco` skill if it isn't already loaded). Don't invent a layout here.
