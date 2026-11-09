# nuco (plugin) — agent guide

The installable **client** plugin for **nuco**: core, rendering, memory and recipe skills,
the `/nuco` command, and the `.mcp.json` that points at the two self-hosted MCP servers — `nuco` (the data plane,
`mcp.nuco.sh`) and `nuco-admin` (the control plane, `admin.nuco.sh`) — served at the host root.
**No server code here** — the server is a self-hosted **FastMCP** service in the sibling repo
`lem4242/nuco-core` (`server/`), on Dokploy + WorkOS AuthKit. **Not Obot** (its containerized
runtime forwards no user identity).

**Design rationale + authoritative scope live in the sibling repo, not here:**
`lem4242/nuco-core` — read its `DEPLOY.md`, `docs/INTERFACE.md` (the generated verb map),
`docs/CATALOGUE.md` (subsystem behaviour), `docs/SURFACE.md` (the model-facing copy), and
`docs/DECISIONS.md`; for current live state run `bin/stream state` there.
`db/schema.sql` there is the authoritative DDL. (Do **not** follow `plans/HANDOFF.md` — it is
frozen at 2026-07-06 and kept only as the record up to that date.)

## What the store is (for the skill's sake)
- **ParadeDB** (Postgres). `search` fuses BM25 keyword search with semantic/vector search
  across documents, files, images and the caller's own memory.
- Two citizens: messy markdown **documents** (append-only) and ordinary **relational tables**
  (write the SQL — don't compute over prose).
- **Projects-as-schemas.** Each project is a Postgres schema with its own `doc` table and relational
  tables; `project` is **required** on project-scoped data verbs — name the one you're in (ask the user if it
  isn't established); reads may pass `all` only for an explicit cross-project search. No implicit default. Personal memory verbs take no project; `search(kind="memory")` may omit it.
- **Identity = verified.** WorkOS AuthKit gives the server the user's email; it maps to a Postgres
  role (`SET LOCAL ROLE`). The server supplies the author — the model never sets it. **Security =
  the Postgres grants**; always prefer the least-permission, least-destructive verb.

## The surface the skill drives (canonical: `nuco-core/docs/INTERFACE.md`)
- **Orient first:** `nuco_context` — identity, the projects you can read/write, and their tables/keys.
  Both root and project context report deployment `capabilities`, including `public_serving`.
- **Documents:** `doc_list` · `doc_read` · `doc_history` · `doc_write` (states:
  draft | active | archived; default active; a free-text `type` axis, default note for a new doc;
  a save appends a version, never overwrites).
- **Tables:** `db_describe(project, table)` · `db_read` · `db_upsert` · `db_write`.
  `db_write(project, sql, dry_run=True)` previews row changes and DDL; use SQL WHERE clauses for
  targeted mutations. `nuco_context(project=…)` lists the project's tables.
- **Files:** `file_list` · `file_read` · `file_write` · `file_move` · `file_delete` · `file_url` · `file_private_url`.
  `file_list` returns names and paths; drill into folders with `area` and `folder`, and pass a returned
  `next_cursor` as `cursor` with the same project and neither of those. `file_read` accepts exactly one
  of `file_id` or `path`; for images, `size` controls the longest edge and the picture appears in chat.
  Files in `public/` are published to the world. `file_url` returns the public URL of a file
  under `public/` when public serving is enabled; on any other file it refuses (move the file to
  `public/` to publish it). `file_private_url` gives an expiring private link to a file that is
  not published. A file under `public/` has no public URL when serving is off; it does not fall
  back to a private signed link. `file_write` creates or updates
  a file; a write under `public/` has a URL only when `capabilities.public_serving` is true.
  While publishing, `file_write`, `file_move` and `file_url` return `publishing_hint`: the URL
  is final, normally serves within about a minute, and can be shared now without re-checking.
- **Search:** `search(project, query, kind=None, limit=10)` — meaning fused with keywords.
  `kind` selects doc | file | image | memory; omit it for all kinds. For document type/state
  filters use `doc_list`, then inspect matching documents with `doc_read`.
- **Memory:** `memory_read(query=None, history=False, at=None)` · `memory_add` — personal,
  identity-scoped rows; a plain read returns the generated profile body, its `written_at` and
  `pending_facts` freshness fields, and open items. Nonzero pending facts prompt a query read,
  including before a profile exists. Subject groups and subject-bearing open items include
  `subject_kind`; the `nuco-memory` skill adds client capture policy.
- **Jobs:** `job_request` · `job_list` · `job_read` · `job_cancel` — offload async work to a cold
  worker (submit self-contained `project`, `title`, `instructions`, optional `payload` and
  `run_after`); track with `job_list` / `job_read` and cite a finished job's output like any source.
- **Admin** runs on the separate `nuco-admin` instance with its own provisioning verbs — not the
  data verbs. **Creating a user requires `email`, `username`, and `phone`**. The display username is
  unique, 1–64 chars: ask the operator for it — don't invent one. It's how the person appears in member lists and as a document author, and
  it names their personal Drive folder (which is shared into their own Drive on creation). The username
  is **immutable** once set — there is no self-service change (users can't rename themselves); only an
  admin re-running `user_create` can correct it, which also reconciles a missing home folder / share.

## Guardrails
- **Append-only docs:** `doc_write` adds the next version for the same `doc_key`; never overwrite.
- **Narrate denials:** a refused write surfaces `permission denied` — say so and offer the read
  path; don't crash or pretend it worked.
- **Keep the client lean:** skills + commands + `.mcp.json` only — no server code in this repo.
- **Keep server design in nuco-core:** follow its current generated interface and catalogue;
  do not add server implementations to the plugin.

## Working rules

- **When this file disagrees with the code, the CODE WINS — fix the doc in the same PR.**
  Adopted from invo, and from nuco-core, which learnt it the hard way: `docs/SURFACE.md` there
  claimed 11 admin verbs against 21 registered, and shipped *"There is no destructive delete
  here"* into the live admin `instructions=` beside a `project_delete` annotated
  `destructiveHint`. A stale doc that a MODEL reads before acting is a live defect, not tidying.
- **No agent-local memory.** Do not write to the client's auto-memory
  (`~/.claude/projects/*/memory/`) or any other per-machine / per-account store, even when the
  harness prompt invites it. It does not travel with a handover to another account or box, and it
  diverges from the record silently. Durable knowledge goes where the next session can read it
  whoever and wherever they are: **this file** for plugin rules, a **nuco document** for platform
  or operational knowledge, the sibling repo's `plans/<slug>/` for work in progress, and a
  **tooling guard** (a test, a hook check) for anything that is really "a check that should run".
  A note saying "remember to verify X" is a missing guard, not a memory. nuco-core (#975) and
  nido (#478) adopted this within days of each other; this repo is the last of the four.
- **Coupled changes.** A change here that needs a server change is one slug, two PRs: the plan and
  decisions live in nuco-core's `plans/<slug>/`, and the worktree here comes from
  `bin/stream link <slug>` there. This repo carries only plugin code.
