# nuco views → required data (one call per view)

Render rules are in `SKILL.md` → "Rendering"; worked screens are in `example.md`. This is the
**data backlog**: the goal is that **one tool call paints one view**. For each screen — does a
single call do it today, and if not, the platform change to get there.

## Per view

| View | One call today? | Action |
|:--|:-:|:--|
| **root → projects** | ✗ | **Extend `nuco_context`** — per project add `name`, `description`, `doc_count`, `members[]`, `connector_count`, `updated` (already has `table_count`, `can_write`). |
| **project → home** | ✗ (~5 calls) | **New `project_home(project)`** — meta + `documents{count, by_type}` · `tables{count, names}` · `assets{count, by_ext}` · `connectors{count, names}` · `members[]`. |
| **documents** (+ type-scoped) | ✗ | **New `doc_list(project, type?, state?, sort, limit, offset)`** → `title, type, version, state, updated, summary, slug`. Type filter gives the type-scoped view. |
| **db** (tables list) | ✗ | **Extend `db_describe`** (list form) — add approx `row_count` (`pg_class.reltuples`, no scan) + a `system` flag on `doc`/`nuco_audit`. |
| **table view** | ✗ (2 calls) | **Extend `db_read`** — return column **types** alongside the rows (drives the cell-type renderers). |
| **assets** | ✓ | `file_list` is complete (name, mime, size, modifiedTime, webViewLink). |
| **document view** | ✓ | `doc_read` is complete (title, type, version, state, body, created_at). |
| **search** | ✗ (2 calls) | *Optional*: unified `search`, or `doc_search` with `include_files`. Lowest priority. |

## The platform work, deduped

**Extend 3 existing tools**
- `nuco_context` → per project: `name`, `description`, `doc_count`, `members[]`, `connector_count`, `updated`.
- `db_describe` (list form) → per table: approximate `row_count`, `system` flag.
- `db_read` → column `types` alongside the rows.

**Add 2 new tools**
- `project_home(project)` → the entire home in one call (meta + per-section summaries + members). Kills the ~5-call fan-out — **highest value**.
- `doc_list(project, type?, state?, sort, limit, offset)` → deterministic, paginated list. Replaces "search-as-a-list"; powers the documents view and its type-scoped form.

**Already complete** — `file_list` (assets), `doc_read` (document view).

**Optional** — unified `search` (docs + files in one call).

## Notes
- `updated` everywhere = last-activity timestamp; derive from `max(created_at)` / `nuco_audit` until it's first-class on the model.
- `members[]` = verified emails, returned in the **data plane** (not the admin `project_members` tool).
- `doc_count`, `by_type`, `by_ext`, `row_count` are cheap aggregates the server can compute in the same query — they don't need their own round-trips.
