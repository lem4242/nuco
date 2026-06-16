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
  `— nuco · {project} · {role}`. `/nuco off` → stop appending and stand down.
- The heartbeat is a smoke alarm: if it stops appearing, you've likely slipped out of context —
  the user should re-invoke `/nuco`. Never fake it; if you're unsure of the project or role,
  say so rather than guessing.

## Saving
- **"remember this"** → insert a `doc` with `kind='memory'`, a short AI `summary`, and the raw
  material in `body`. Memories are for *shared/durable* things; personal recall stays in the
  client, not here.
- **"save as a document"** → `kind='document'` (outranks memories in search), the settled
  content in `body`.
- Versioning is **append-only**: to edit, insert the next `version` for the same `doc_key` —
  never `UPDATE` in place. Set `author` from the current user and `project` from context.

## Searching (BM25 — this is ParadeDB, not vanilla Postgres)
- Use `pg_search` BM25 with the `@@@` operator, **never** `LIKE`/`ILIKE`. Run `@@@` against the
  base `doc` table and **join `doc_current`** to keep only latest versions — `paradedb.score()`
  must reference the base table alias:
  ```sql
  select dc.title, dc.kind,
         paradedb.score(d.id) + case when dc.kind = 'document' then 0.4 else 0 end as rank
  from doc d
  join doc_current dc on dc.id = d.id
  where d.body @@@ 'terms' or d.title @@@ 'terms'
  order by rank desc;
  ```
- The `+0.4` is a **tie-breaker** nudging documents above comparably-relevant memories — it won't
  (and shouldn't) bury a much-more-relevant memory. Do **not** hard-tier on `kind`.
- The index stems **inflections** (payment/payments, flag/flagged/flagging), but NOT derivational
  variants (reconcile↔reconciliation) or compounds (rollback↔"roll back"). For those, **expand the
  query** with the variants (e.g. `'reconcile reconciliation'`) or use fuzzy match.
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
