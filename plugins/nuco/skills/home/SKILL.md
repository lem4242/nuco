---
name: home
description: Jump the cursor to your home project (your personal nuco project) and list its files. Runs on `/nuco:home`. Fast markdown — no widget.
---

# /nuco:home — go home + list files

1. Call `nuco_context`; your `personal_project` is home (currently `lynton_vivelia`).
2. Set the **cursor** to that project.
3. List its files with `file_list` (project = home). Render as a markdown table — `| file | type | updated |` — using only the fields nuco returns; drop columns that aren't returned rather than inventing them.
4. Footer: `nuco > <home>` — `/nuco:db` tables · `/nuco:assets` · `/nuco:search <q>` · `/nuco:start` for the project list.
5. Heartbeat: `— nuco > <home>`.

Markdown only — no `show_widget`.
