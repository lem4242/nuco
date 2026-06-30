---
description: Switch to a project and render its home, or list projects
argument-hint: "[name]"
---

The user invoked nuco project with argument: `$ARGUMENTS`

Use the **nuco** skill (load it if it isn't already). No argument → render the **project list**
(the root grid, from `nuco_context`); a name → move the cursor into that project and render its
**project home**. Render per the skill's **Rendering** spec. Wake the breadcrumb heartbeat exactly
as `/nuco` does. Markdown, never a widget.
