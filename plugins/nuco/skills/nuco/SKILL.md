---
name: nuco
description: Use when working with the nuco shared store — saving a memory or a document, searching or recalling past documents, or creating and querying relational tables in the nuco2 ParadeDB database. Also handles the "/nuco" on/off toggle and the per-message status heartbeat. Trigger on "remember this", "save to nuco", "find in nuco", "what did we decide about…", comparing/aggregating data the user keeps in nuco, or any nuco table work.
---

# nuco — shared store operating skill

nuco is a **shared, queryable store** — *git for shared data and documents*. It holds what the
client can't: shared, durable, cross-context state. Two citizens:

- **documents** — messy markdown in the `doc` table — qualitative memory and outputs.
- **relational tables** — quantitative data you query, join, and aggregate.

The store is **ParadeDB** (Postgres), reached through the Obot composite's Postgres MCP. Always
use the **lowest-permission** tool that does the job.

## On/off and the heartbeat
- `/nuco on` → engage the store and **append a status line to the end of every reply**:
  `— nuco · {role}`. `/nuco off` → stop appending and stand down.
- **Discover your role from the database, don't guess.** Run `select current_user;`. Roles are
  named `{store}_{role}` (e.g. `nuco2_editor` → role `editor`; `nuco2_admin` → role `admin`). Take
  the segment after the last `_` as `{role}`. The store/scope is the connection itself, so the
  heartbeat only needs the role.
- The heartbeat is a smoke alarm: if it stops appearing, you've likely slipped out of context —
  the user should re-invoke `/nuco`. Never fake it; if `current_user` doesn't look like
  `{store}_{role}`, say so rather than guessing.

## Saving
- **Preferred one-call path (esp. for light models):**
  `select * from nuco_save(in_kind => 'memory'|'document', in_title => '…', in_body => '…',
  in_author => '<the user's identity>', in_summary => '…', in_doc_key => <uuid-or-omit>);`
  It auto-computes the version (omit `in_doc_key` for a new doc → v1; pass it to append the next
  version) and returns `out_doc_key, out_version`. Honors the same grants as raw SQL.
- **"remember this"** → `kind='memory'`, a short `summary`, the raw material in `body`. Memories are
  for *shared/durable* things; personal recall stays in the client, not here.
- **"save as a document"** → `kind='document'` (outranks memories in search), the settled content in
  `body`. (`kind` is free text the skill governs — `memory`/`document` for v1.)
- Versioning is **append-only**: to edit, insert the next `version` for the same `doc_key` — never
  `UPDATE` in place. A capable agent may write the raw INSERT instead of the helper; set `author`
  from the current user.

## Searching (BM25 — this is ParadeDB, not vanilla Postgres)
- **Preferred one-call path:** `select * from nuco_search('your terms');` — the canonical
  current-only BM25 query with the document boost, ranked. Cap with `nuco_search('terms', 20)`.
  Prefer this; drop to raw SQL (below) only for history/audit or boost-latest.
- Use `pg_search` BM25 with `@@@`, **never** `LIKE`/`ILIKE`. `paradedb.score()` must reference the
  **base table alias** (`d`). Three modes (default = current-only):
  - **Current-only (default)** — latest version per doc:
    ```sql
    select dc.title, dc.kind,
           paradedb.score(d.id) + case when dc.kind='document' then 0.4 else 0 end as rank
    from doc d join doc_current dc on dc.id = d.id
    where d.title @@@ 'terms' or d.body @@@ 'terms' or d.summary @@@ 'terms'
    order by rank desc;
    ```
  - **All versions (history / audit)** — `@@@` on `doc`, no `doc_current` join:
    ```sql
    select id, doc_key, version, title from doc
    where title @@@ 'terms' or body @@@ 'terms' or summary @@@ 'terms'
    order by paradedb.score(id) desc;
    ```
  - **Boost-latest** — search all versions but nudge the current one up (stacks with the doc boost):
    ```sql
    select distinct on (d.doc_key) d.doc_key, d.version, d.title,
           paradedb.score(d.id) + case when dc.id is not null then 0.3 else 0 end
                                 + case when d.kind='document' then 0.4 else 0 end as rank
    from doc d left join doc_current dc on dc.id = d.id
    where d.title @@@ 'terms' or d.body @@@ 'terms' or d.summary @@@ 'terms'
    order by d.doc_key, rank desc;
    ```
- The `+0.4` (document) / `+0.3` (latest) boosts are **additive tie-breakers** — they won't bury a
  much-more-relevant row. Do **not** hard-tier on `kind` or version.
- The index stems **inflections** (payment/payments, flag/flagged/flagging), but NOT derivational
  variants (reconcile↔reconciliation) or compounds (rollback↔"roll back"). For those, **expand the
  query** with the variants (e.g. `'reconcile reconciliation'`) or use fuzzy match. Expansion happens
  in the terms you pass to `nuco_search`/`@@@`.
- Semantic / vector search is **not enabled yet** — BM25 only.

## Tables (the quantitative citizen)
- For aggregation, joins, comparisons, counts and totals, **create or query ordinary Postgres
  tables** and write the SQL directly. Don't reason numbers out of prose — put them in a table
  and query it.
- You are the DBA: use `EXPLAIN`/`EXPLAIN ANALYZE` and add indexes when a query is slow.

## Discipline
- Confirm before destructive or irreversible writes.
- Discover what you can do by introspecting your grants. If a write is denied, **narrate it**
  ("no editor access to {project}") and offer the read path or to ask an admin — don't crash or
  pretend it worked.
