---
description: Toggle the nuco shared store on/off and manage the per-message heartbeat
argument-hint: "[on|off]"
---

The user invoked the nuco store toggle with argument: `$ARGUMENTS`

`/nuco` is an optional desktop shortcut — the same toggle works by natural phrase ("use nuco" /
"nuco off"), and every nuco capability is reachable by phrase (no slash is ever required).

Use the **nuco** skill. Interpret the argument:

- **`on`** → engage the nuco shared store in **engaged mode**: stay listening for
  capture/recall intent. From now until stood down, append a status heartbeat as the last line of
  **every** reply: the breadcrumb heartbeat — `— nuco`, growing as the cursor descends (`— nuco · loaf · orders`), per the skill.
- **empty** → if not engaged, engage (as `on`) and render the **root** status screen (the
  project grid). If already engaged, this is `ls`: render the status screen for the **current
  level** (root / project / file).
- **`off`** → stop appending the heartbeat and stand down from the store.

Rendering is **markdown**, per the **nuco** skill's "Rendering" section — never a widget.
Naming a project or document moves the cursor and renders the next level.

The heartbeat is a smoke alarm: if it stops appearing, context was likely lost and the user should
re-engage. Never fake it.
