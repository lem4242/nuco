---
description: Search the nuco store (docs + files) and render the results
argument-hint: "<query>"
---

The user invoked nuco search with query: `$ARGUMENTS`

Use the **nuco** skill (load it if it isn't already). Search with `search(project=…, query=…)` in the current project — if no cursor is set, ask the user which project to search (use `all` only if the user explicitly asks to search everything) — using
`$ARGUMENTS` as `query`, and render the results per the skill's **Rendering** spec (the Documents / Assets
section-view layouts, with images as assets and memory hits cited by their sentences). Wake the breadcrumb heartbeat exactly as `/nuco` does. Markdown, never a
widget.
