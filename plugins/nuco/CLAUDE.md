# nuco (plugin) — agent guide

The installable plugin for **nuco2**: a `nuco` skill, the `/nuco` command, and the Obot composite
MCP config (`.mcp.json`). **No server code** — the MCP is an off-the-shelf Postgres MCP composed by
Obot over a managed ParadeDB instance.

**Design rationale + authoritative scope live in the sibling repo, not here:**
`lem4242/nuco2-project` — read its `plans/PHASE-1.md`, `plans/HANDOFF.md`, and `docs/DECISIONS.md`
first. `db/schema.sql` there is the authoritative, current DDL.

## What the store is (for the skill's sake)
- **ParadeDB** (Postgres). Search is **BM25** via `pg_search` (the `@@@` operator), **never**
  `LIKE`/`ILIKE`. Semantic/vector search is not enabled yet.
- Two citizens: messy markdown **documents** (the append-only `doc` table) and ordinary
  **relational tables** (write the SQL — don't compute over prose).
- **The connection is the scope** — there is no `project` column. **Security = grants**; always
  prefer the lowest-permission tool that does the job. **Identity = audit** (`author` is
  AI-supplied, not forgery-proof).

## Guardrails
- **Helpers for the common path:** `nuco_save(...)` (append-only, auto-version) and
  `nuco_search('terms')` (current-only BM25 + document boost) are the preferred path, especially for
  light models. Drop to raw SQL for relational tables/joins and the history / boost-latest search
  modes. Don't add more helpers — the set is closed (ADR-022).
- **Append-only:** never `UPDATE`/`DELETE` a `doc` row; insert the next `version` for the same
  `doc_key`.
- **Narrate denials:** a refused write surfaces `permission denied` — say so and offer the read path;
  don't crash or pretend it worked.
- **Keep skills few**; no server code; don't reintroduce deferred features (handoff, supervisor,
  dispatcher, job queue, RLS, schema-per-project, embeddings, media) — those are design-on-record in
  `nuco2-project` (ADR-017/019/021), not built.
