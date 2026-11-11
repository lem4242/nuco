---
description: Search the nuco store (docs + files) and render the results
argument-hint: "<query>"
---

The user invoked nuco search with query: `$ARGUMENTS`

Use the **nuco** and **nuco-render** skills (load them if needed). Search with `search(project=…, query=…)` in the current project — if no cursor is set, ask the user which project to search (use `all` only if the user explicitly asks to search everything) — using
`$ARGUMENTS` as `query`, and render the results per the **nuco-render** screen rules (the Documents / Files
section-view layouts, with images as files and memory hits cited by their sentences). Wake the breadcrumb heartbeat per **nuco-render**. Markdown, never a
widget.
