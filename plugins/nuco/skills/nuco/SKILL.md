---
name: nuco
description: Use when the nuco shared store is engaged — capturing what the user points at ("remember this", "note that", "save where we got to", "write that up"), recalling past work ("what did we decide about…", "find the memory on…"), or working with the team's shared tables. On "what did we…" questions, search nuco BEFORE the web. Capture only on explicit intent.
---

# nuco — shared-memory operating judgment

nuco is the team's shared, durable store: documents (append-only prose) and tables (structured
data), organised into projects. The tools and the server's own instructions tell you how to
call them — `nuco_context` first, `project` to target a scope, `doc_*` for prose, `db_*` for tables.
This skill is only about doing it well.

The line that matters: your client's own memory is private and ephemeral; nuco is shared and
durable. Put something in nuco when it must outlive this chat, be seen by a colleague, or be read by
a later job. Keep everything else in the client.

## Capturing — the user gestures, you author

The user points ("remember this", "note that", "write that up"); you compose the document and
you choose its state. The user never writes store text and never picks a category.

Pick the state by where the idea is, not what it's about — one universal axis:

- **saved** — captured, not yet in force. The default. A working note, a proposal, a snapshot you're
  recording unilaterally — anything you're keeping but not yet asking anyone to rely on.
- **active** — current and relied-on. Promote to this when the thing is in force: a write-up the user
  agreed to, a decision that now holds, a durable fact to rely on. **`state = active` means "rely on this".**
- **archived** — retired or superseded.

`summary` doubles as the document's subtitle — write it as a short one-line description, not a
restatement of the title.

**Classify every save with a `type`** — a short free-text genre (lower-cased, >= 3 chars) for *what
kind of doc this is*, orthogonal to state. Pick `note` when nothing more specific fits; `memory` for a
durable fact to recall, `decision` for a choice that holds, `spec`/`brief`/etc. as they emerge. It's
**required** — `doc_write` rejects a save without one — and you can narrow recall by it
(`doc_search type:"decision"`).

One idea = one `doc_key`, advanced by version. A capture that moves the same idea forward is the
next version of that `doc_key` (pass the existing key), not a new document. The natural arc
**saved → … → active** is the version history of one key.

Keep the negative space. When a proposal is rejected, don't delete it — save the next version and
write down why it was rejected (the feedback that killed it) in the new body/summary. The
"why-not" is often worth more later than the thing that won. Append-only means the trail survives;
use it.

Keep documents digestible. Present ~a page for agreement; if a thing is big, split it into several
documents rather than one sprawling one.

## Recalling — store first, cite always

- On "what did we decide / find / agree", **search nuco before the web**. Only fall back to the
  web if nothing lands; never silently web-search a "what did we…" question.
- **Cite provenance:** when you answer from the store, name the source — title · state · date. Say
  plainly whether you're grounded in a stored doc or inferring.
- **Stale data:** don't say "I don't have it" — say when it was last updated and offer to work with it
  or refresh ("sales last updated Tue 11pm — refresh, or use what we've got?").

## Rendering — the navigable status screens

nuco is navigable like a filesystem: an ambient **cursor** sits at one of three levels —
**root** (no project), **project**, or **file** (a document or table). "Show me nuco" /
"ls" / `/nuco` renders the current level's **status screen** as a styled inline widget;
naming a project or doc moves the cursor (`cd`) and renders the next level.

- **root** → project grid (`nuco_context`) · **project** → header + document tiles +
  tables + people + connectors (`doc_search` + table list) · **file** → document view
  (`doc_read`) or table view (`db_read` + `db_describe`).
- The canonical markup is in `skills/nuco/assets/` — one file per screen (see its
  `README.md`). To render: copy the template, inject the live values into the `{{TOKENS}}`,
  strip the comment header, and emit it with the visualize `show_widget` tool — the only way
  to show styled HTML inline. **One screen = one widget. Static: no timers, no
  auto-refresh.** A document body reads better as markdown in your reply than inside the
  widget.
- **Navigation is conversational:** a tile click fires `sendPrompt('nuco: open …')`, which
  re-renders the next level. Carry the breadcrumb in the heartbeat (`| n – nuco_dev /
  nuco-as-os`).
- **Degrade gracefully.** Some fields aren't returned yet (project name/description,
  doc/connector/member counts, doc version + updated time, the members list). Fall back —
  key as name, hide absent counts/version/time, mark People/Connectors pending. Never emit a
  literal `{{TOKEN}}`. The fields to add server-side are listed in `assets/PLATFORM-GAPS.md`.
- Keep it lean: a shared `<style>` block + values injected into terse markup is the
  lowest-token styled render; reach for a `<script>` only for the table builder.

## Routing — private by default, shared on purpose

- Omitting `project` keeps a write in your personal project (private). That's the safe default.
- Name the shared project for anything a colleague or a job needs to see. The write tells you
  where it landed — surface that, and surface denials ("no write access there — here's the read path").

## Numbers live in tables

Totals, joins, comparisons, anything quantitative → tables, with SQL. Don't reason figures out of
prose. You're the DBA: inspect with `db_describe`, `dry_run` before big changes, add indexes if slow.

## Usage notes that bite

- Table filters (`where`) take three shapes: `{"col": value}` (eq), `{"col": [a, b]}` (in), or the
  explicit `{"col": {"op": "gte", "value": 100}}` for everything else (`eq/ne/lt/lte/gt/gte/in/is_null`).
  The operator object needs both literal keys — `{"col": {"gte": 100}}` is rejected.
- Numeric columns come back as strings (`"620.00"`) — don't do naive math on them.
- Reads cap at 500 rows (`truncated:true`); `limit` only *lowers* that cap, never raises it. For a
  table bigger than that, aggregate or paginate in SQL rather than expecting every row.
- Search stems inflections (flag↔flagged) but not derivational (reconcile↔reconciliation) or
  compound (rollback↔"roll back") variants — expand the query with the variants yourself.
- Search ranks by relevance and state: `active` is boosted, `archived` is demoted (still findable),
  `saved` is neutral. A `saved` or `archived` hit can still surface — check the `state` column: a
  `saved` hit isn't yet in force, an `archived` hit isn't current.
- For a relied-on answer, search **`state:"active"` first**, then broaden (drop the filter) only if
  nothing lands. `doc_search` with no filter returns every state, so don't treat an unfiltered hit as
  authoritative without checking its `state`.

## Discipline

- Confirm before destructive/irreversible writes.
- Don't hoard — capture on explicit intent + the engaged toggle, not every sentence.
- If a write is denied, narrate it and offer the read path — never pretend it worked.

When engaged, end **every reply** with a one-line heartbeat: an em dash, then the cursor as a
`>`-separated breadcrumb — `— nuco` at root, `— nuco > loaf` inside a project, `— nuco > loaf > orders`
at a file. It's both the live indicator of where the cursor sits and a smoke alarm: if it stops
appearing, the client likely dropped the skill, so re-engage.
