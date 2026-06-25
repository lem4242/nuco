# nuco (plugin) — agent guide

The installable **client** plugin for **nuco2**: a `nuco` skill, the `/nuco` command, and the
`.mcp.json` that points at the two self-hosted MCP servers — `nuco` (the data plane,
`nuco.vivelia.co/mcp`) and `nuco-admin` (the control plane, `nuco-admin.vivelia.co/mcp`).
**No server code here** — the server is a self-hosted **FastMCP** service in the sibling repo
`lem4242/nuco2-project` (`server/`), on Dokploy + WorkOS AuthKit. **Not Obot** (its containerized
runtime forwards no user identity).

**Design rationale + authoritative scope live in the sibling repo, not here:**
`lem4242/nuco2-project` — read its `DEPLOY.md`, `plans/HANDOFF.md`, `docs/SURFACE.md` (the canonical
model-facing surface), and `docs/DECISIONS.md`. `db/schema.sql` there is the authoritative DDL.

## What the store is (for the skill's sake)
- **ParadeDB** (Postgres). Search is **BM25** (`pg_search`); the model reaches it through the
  `doc_search` verb, not raw SQL. Semantic/vector search is not enabled yet.
- Two citizens: messy markdown **documents** (append-only) and ordinary **relational tables**
  (write the SQL — don't compute over prose).
- **Projects-as-schemas.** Each project is a Postgres schema with its own `doc` table and relational
  tables; `project` is the override — omit for your private personal project, name a shared one to
  share.
- **Identity = verified.** WorkOS AuthKit gives the server the user's email; it maps to a Postgres
  role (`SET LOCAL ROLE`). The server supplies the author — the model never sets it. **Security =
  the Postgres grants**; always prefer the least-permission, least-destructive verb.

## The surface the skill drives (canonical: `nuco2-project/docs/SURFACE.md`)
- **Orient first:** `nuco_context` — identity, the projects you can read/write, and their tables/keys.
- **Documents:** `doc_search` · `doc_read` · `doc_history` · `doc_write` (states:
  saved | active | archived; orthogonal `type` axis, default `note`; a save appends a version, never overwrites).
- **Tables:** `db_describe` · `db_read` · `db_upsert` · `db_update` · `db_delete` · `db_write` ·
  `db_alter` (`dry_run` is an arg on the destructive ones, not a separate verb).
- **Admin** runs on the separate `nuco-admin` instance with its own provisioning verbs — not the
  data verbs.

## Guardrails
- **Append-only docs:** `doc_write` adds the next version for the same `doc_key`; never overwrite.
- **Narrate denials:** a refused write surfaces `permission denied` — say so and offer the read
  path; don't crash or pretend it worked.
- **Keep the client lean:** skill + command + `.mcp.json` only — no server code in this repo.
- **Don't reintroduce deferred complexity** (RLS, embeddings, media) — design-on-record in
  `nuco2-project`, not built. The agentic **work fabric / jobs** is being built *there* (Phase 4a),
  not part of this client surface.
