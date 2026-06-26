---
name: nuco-start
description: Engage nuco and show the root — the project grid. Runs on `/nuco-start` (or "open nuco"). Sets the cursor to root and lists every project you can see, rendered as a fast markdown table — no widget.
---

# /nuco-start — engage + list projects (root)

The entry point for the markdown nuco browser. Fast, text-only: a markdown table renders instantly and costs no widget overhead. **Do not open a `show_widget`** — that's the old path.

1. Call `nuco_context` first (always). It returns who you are, the projects you can read/write, and their tables/docs.
2. Set the **cursor** to root (no current project). The cursor is conversation-scoped state you carry for the rest of the session; `/nuco-project <name>` moves it later. (Same cursor the core `nuco` skill describes.)
3. Render the projects as a markdown table:

   | project | access | tables |
   | :--- | :--- | ---: |
   | lynton_vivelia | home · write | 11 |
   | havana | write | 2 |

   Use only what `nuco_context` returns. **Degrade gracefully** — drop cells nuco doesn't return rather than inventing values or emitting a literal `{{token}}`.
4. **Heartbeat:** end the reply with the cursor as the status line — an em dash, then a `·`-separated breadcrumb. At root: `— nuco`; as the cursor moves in it grows (`— nuco · loaf`, `— nuco · loaf · orders`).

Keep it lean — just the table. Nothing quantitative here, so no SQL; this is the project list from `nuco_context`.
