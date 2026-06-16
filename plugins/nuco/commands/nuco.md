---
description: Toggle the nuco shared store on/off and manage the per-message heartbeat
argument-hint: "[on|off]"
---

The user invoked the nuco store toggle with argument: `$ARGUMENTS`

Use the **nuco** skill. Interpret the argument:

- **`on`** (or empty) → engage the nuco shared store. Determine your `role` by running
  `select current_user` and taking the segment after the last `_` (roles are `{store}_{role}`,
  e.g. `nuco2_editor` → `editor`); ask only if that fails. From now until `/nuco off`, append a
  status heartbeat as the last line of **every** reply, exactly: `— nuco · {role}`.
- **`off`** → stop appending the heartbeat and stand down from the store.

The heartbeat is a smoke alarm: if it stops appearing, context was likely lost and the user
should re-invoke `/nuco`. Never fake it.
