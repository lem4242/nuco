---
name: nuco-assets
description: List the files / assets in the current project. Runs on `/nuco-assets`. Fast markdown — no widget.
---

# /nuco-assets — files in the current project

Operates on the **cursor's project** (default = home); state which project.

1. `file_list` scoped to the cursor's project.
2. Render `| file | type | size | updated |` — only the fields nuco returns; drop the rest.
3. **Heartbeat:** `— nuco · <project>`.

To open one, read it directly with `file_read`. Markdown only — no `show_widget`.
