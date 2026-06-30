---
description: Search the nuco store (docs + files) and render the results
argument-hint: "<query>"
---

The user invoked nuco search with query: `$ARGUMENTS`

Use the **nuco** skill (load it if it isn't already). Search documents (`doc_search`) and files
(`file_search`) in the current project — or across everything if no cursor is set — for
`$ARGUMENTS`, and render the results per the skill's **Rendering** spec (the Documents / Assets
section-view layouts). Wake the breadcrumb heartbeat exactly as `/nuco` does. Markdown, never a
widget.
