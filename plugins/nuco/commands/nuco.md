---
description: Wake the nuco shared store and show where you are; `off` to stand down
argument-hint: "[off]"
---

The user invoked nuco with argument: `$ARGUMENTS`

`/nuco` is an optional desktop shortcut — the same wake works by natural phrase ("use nuco"), and
every nuco capability is reachable by phrase (no slash is ever required).

Use the **nuco** skill. Interpret the argument:

- **empty** → **wake**: force-load the **nuco** skill and render **where you are** — the status
  screen for the **current level** (root / project / file). If there's no cursor yet, that's the
  **root** screen (the project grid). From now on, append the breadcrumb heartbeat as the last line
  of **every** reply — `— nuco` at root, `— nuco · <project>` once inside a project — per the skill.
  Naming a project or document moves the cursor and renders the next level.
- **`off`** → stop appending the heartbeat and stand down from the store.

There is no separate "on" — waking *is* invoking, and you stay woken until context drops the skill
(the heartbeat stops) or the user says `off`. Re-run `/nuco` to wake it again.

Rendering is **markdown**, per the **nuco** skill's "Rendering" section — never a widget.

The heartbeat is a smoke alarm: if it stops appearing, context was likely lost and the user should
re-run `/nuco`. Never fake it.
