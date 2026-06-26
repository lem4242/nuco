---
name: nuco-search
description: Search the nuco store — documents and files — in the current project or across everything. Runs on `/nuco-search <query>`. Fast markdown — no widget.
---

# /nuco-search <query> — find docs & files

Query is `$ARGUMENTS`. Scope to the **cursor's project** if one is set; otherwise search across all projects (say which).

1. `doc_search` for documents. Respect ranking — `active` boosted, `archived` demoted; for a relied-on answer search `state:"active"` first, then broaden. Search stems inflections but not derivational/compound variants, so expand the query yourself.
2. `file_search` for files.
3. Render hits as a markdown table — `| title | type | state | project | updated |` — and **cite provenance**. Flag each hit's `state` (a `saved` hit isn't yet in force; an `archived` hit isn't current).
4. **Heartbeat:** `— nuco · <project>` (or just `— nuco` when searching everywhere).

Markdown only — no `show_widget`.
