---
name: start
description: Engage nuco and show the root — the project grid. Runs on `/nuco:start` (or "open nuco"). Sets the cursor to root and lists every project you can see, rendered as a fast markdown table — no widget.
---

# /nuco:start — engage + list projects (root)

The entry point for the markdown nuco browser. Fast, text-only: a markdown table renders instantly and costs no widget overhead. **Do not open a `show_widget` for this** — that's the old path.

1. Call `nuco_context` first (always). It returns who you are, the projects you can read/write, and their tables/docs.
2. Set the **cursor** to root (no current project). The cursor is conversation-scoped state you carry for the rest of the session; `/nuco:project <name>` moves it later. (Same cursor the core `nuco` skill describes.)
3. Render the projects as a markdown table:

   | project | access | contents |
   |---|---|---|
   | personal | private | docs · db · assets |
   | loaf | shared · 6 | docs · db · code · assets |

   Use only what `nuco_context` returns. **Degrade gracefully** — if member counts or doc/table counts aren't returned, drop those cells rather than inventing values or emitting a literal `{{token}}`.
4. Footer line — breadcrumb + the next moves:
   `nuco /` — `/nuco:project <name>` to enter · `/nuco:home` · `/nuco:search <q>`
5. **Heartbeat:** the cursor rides the status line — an em dash then a `>`-separated breadcrumb. At root end the reply with `— nuco`; as the cursor moves in it grows (`— nuco > loaf`, `— nuco > loaf > orders`). This is how the current project stays visible every turn.

Keep it lean — one markdown table + a footer. Nothing quantitative is being computed here, so no SQL; this is just the project list from `nuco_context`.
