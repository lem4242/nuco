---
name: nuco-home
description: Jump the cursor to your home project (your personal nuco project) and list its files. Runs on `/nuco-home`. Fast markdown — no widget.
---

# /nuco-home — go home + list files

1. Call `nuco_context`; your `personal_project` is home (currently `lynton_vivelia`).
2. Set the **cursor** to that project.
3. List its files with `file_list` (project = home). Render as a markdown table — `| file | type | updated |` — using only fields nuco returns; drop columns that aren't returned.
4. **Heartbeat:** `— nuco · <home>`.

Markdown only — no `show_widget`.
