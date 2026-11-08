---
description: Switch to a project and render its home, or list projects
argument-hint: "[name]"
---

The user invoked nuco project with argument: `$ARGUMENTS`

Use the **nuco** and **nuco-render** skills (load them if needed). No argument → render the **project list**
(the root grid, from `nuco_context`); a name → move the cursor into that project and render its
**project home**. Render per the **nuco-render** screen rules. Wake the breadcrumb heartbeat per **nuco-render**. Markdown, never a widget.
