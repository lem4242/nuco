# nuco views → required data (one call per view)

Render rules are in `SKILL.md` → "Rendering"; worked screens are in `example.md`. This was the
**data backlog**: the goal is that **one tool call paints one view**.

> **Status — shipped 2026-06-27** (`nuco2-project` → `feat/registry-cache-and-profiles`). The data
> now exists; every view below is served by a single call. What landed, per view:

## Per view

| View | One call now? | How |
|:--|:-:|:--|
| **root → projects** | ✓ | **`nuco_context`** — each tile carries `name`, `description`, `access`, `doc_count`/`doc_counts`, `table_count`, `member_count`, `members[]` (display names), `connector_count` (0 — out of scope), `updated`. Counts come from cached registry columns; member names join the proxy-only `nuco_user`. |
| **project → home** | ✓ | **`nuco_context(project=<key>)`** — a bundle: `meta{name, description, access, updated}` · `documents{count, by_state, by_type[], page[]}` · `tables[]{name, system}` · `assets{count, by_ext}` · `connectors{count:0, names:[]}` · `members[]{email, username, role}`. (Replaces the planned separate `project_home`.) |
| **documents** (+ type-scoped) | ✓ | **`doc_search`** now returns `version` + `updated` (joins `doc_current`), so a hit renders the full tile. The bundle's `documents.page` seeds the list; a deterministic paginated `doc_list` stays a future add for deep pages. |
| **db** (tables list) | ✓ | **`db_describe`** (list form) returns approximate `row_count` (`pg_class.reltuples`, no scan) + a `system` flag on `doc`/`nuco_audit`. |
| **table view** | ✓ | **`db_read`** returns `column_types[]` alongside the rows (in-process OID→name; `numeric` stays a string for precision — the type tells the renderer it's money). |
| **assets** | ✓ | `file_list` is complete (name, mime, size, modifiedTime, webViewLink). |
| **document view** | ✓ | `doc_read` returns a **document object** `{doc_key, version, type, state, title, summary, body, author, author_username, updated}` (author resolved to a display name via the proxy-only `nuco_user`, email fallback). |
| **search** | ~ | `doc_search` paints it (now with `version`/`updated`); a unified docs+files `search` stays *optional*, lowest priority. |

## What shipped (deduped)

**Extended 3 existing tools**
- `nuco_context` → per project: cached `name`, `description`, `doc_count`/`doc_counts`, `member_count`,
  `members[]`, `connector_count`, `updated`, plus an `access` cell — and a new **`project=<key>` bundle
  mode** (the whole home in one call, subsuming the planned `project_home`).
- `db_describe` (list form) → approximate `row_count` + `system` flag per table.
- `db_read` → `column_types[]` alongside the rows.

**Enriched, not a new tool**
- `doc_search` → adds `version` + `updated` (joins `doc_current`), so a hit renders the full tile.
  A deterministic paginated `doc_list` is deferred — the bundle's `documents.page` + `doc_search`
  cover today's views.

**Reshaped** — `doc_read` → a document object (was `{columns, rows}`), with `author_username`.

**New write paths (round-trip closure)**
- `project_update(project, name?, description?)` — rename / re-describe in place (data-plane,
  write-member self-service; the schema key stays immutable).
- `user_set_username(username)` — set your own display name (defaults to the email local-part).

**Already complete** — `file_list` (assets).  **Optional** — unified `search` (docs + files in one call).

## How the data is kept cheap
- `updated` / `doc_count` / `doc_counts` are **cached columns on `public.nuco_project`**, maintained by
  a SECURITY DEFINER AFTER-INSERT trigger on each project's `doc` (recompute from `doc_current`,
  `FOR UPDATE`-serialized). `member_count` is maintained by the admin grant/revoke verbs. So the grid
  is one cheap read, not a per-project aggregate fan-out.
- `members[]` resolve display names from a new **proxy-only `public.nuco_user`** directory (username
  defaults to the email local-part, updateable) — member lists + doc authors render names, not emails.
- `connector_count` is `0` — connectors are out of scope this pass (the home renders a placeholder).
