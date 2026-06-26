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

nuco is a shell. An ambient **cursor** persists between messages at one of three levels —
**root** (no project), **project**, or **file** (a document or table). `/nuco` (or "ls" /
"show me") renders **the current level** — "show me where I am"; naming a child is `cd`, a
back-link is `cd ..`. **Always render in markdown — never a widget.** The heartbeat carries
the path-of-**keys** (addressable); screen headings use the readable **names**.

**Glyphs — monochrome unicode only** (no colour emoji; the only HTML is `<br>`; colour, size and vertical-align are the client's, not ours):

- **column-header glyphs:** `☲` docs · `⛁` tables · `◷` updated · `⤓` size · `✎` access · `⚑` state
- **access cells:** `⌂` home · `rw` write · `r` read-only
- **state cells:** `✓` active · `○` saved · `✗` archived · `→` superseded — glyph only, no word
- **relative time** (the `◷` column): abbreviated — `2 mins` · `3 hrs` · `4 days` · `2 wks` · `5 mos`

**root → projects** — `nuco_context`, one row per project (mobile-narrow):

| Project | ☲ | ⛁ | ◷ | ✎ |
|:---|:---:|:---:|:---:|:---:|

The `Project` cell stacks (via `<br>`): **bold Name**, a one-line description, then the **member
names as a plain comma list** (no label). Columns: `☲` docs · `⛁` tables (= `table_count`) · `◷`
relative updated · `✎` access cell = `⌂` home / `rw` write / `r` read (from personal / `can_write`).
Only `tables` is live in `nuco_context` today; description / members / docs / updated → placeholder
(`—`) until the calls return them.

**project → detail** — `cd <project>`: a `## <name>` heading (+ a description line if present),
then these sections, each **omitted when empty**:

- **Documents (n)** — `doc_search` that project → `| Document | Type | ◷ | ⚑ |`. The `Document`
  cell stacks **bold Title** + ` vX` then a one-line subtitle (the `summary`, truncated) via
  `<br>`; `◷` = relative updated; `⚑` (state) cell = **glyph only** (`✓`/`○`/`✗`/`→`), no word.
  `vX` is a placeholder until the API returns version.
- **Tables (n)** — `db_describe` → `| Table | Rows |`. **Always hide the `doc` and `nuco_audit`
  tables** (the documents store + audit log — system tables surfaced elsewhere); list only the
  project's own data tables. Table names are **plain, not bold**.
- **Assets (n)** — `file_list` → `| Asset | ⤓ | ◷ |` (`⤓` heads the size column; no type column —
  the filename extension carries it). The `Asset` name is a **markdown link to its `webViewLink`**
  (opens the Drive file), **plain, not bold**. Size is compact `Kb`/`Mb` — `2.4Mb` · `12Kb` ·
  `340b`, no space (quiet metadata, not `2.4 MB`). Empty → _No assets yet_.
- **People** · **Connectors** — `— pending` until the API returns them. Members count for the
  header comes from `project_members` (one call, this project).

**file → document or table** — `cd <doc|table>`:

- **document** (`doc_read`) — a `## <Title>` heading, a meta line
  `<type> · vX · <state glyph> · ◷ <relative>`, then the **body rendered as markdown** in the reply.
- **table** (`db_read` + `db_describe`) — a markdown table following the header rule (numbers
  centred in markdown, right-aligned only in an HTML render); `date` absolute, `since` relative
  (mins/hr/day…); `status` = the plain state word; rich cells (tags / user / progress) **fall
  back to raw text**. Cap 500 rows; show the count and whether it `truncated`.

**Always:** header row = first column left, **every other column centred** (`:---:`), headers
included. Right-alignment is reserved for **number columns only** and never used on text — but
markdown ties a column's header and body to one setting, so a number column is **centred in
markdown** (centred headers win); the right-align applies only in a render that can align header
and body independently (HTML/widget). **Capitalise the first letter of every title** (column headers, row titles, headings). Keep
columns few, degrade genuinely-empty values to `—`; for fields the API doesn't return yet, show
an interface **placeholder** (`vX`, `_description_`, `Updated —`) rather than nothing. End the
screen with the heartbeat breadcrumb.

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
`·`-separated breadcrumb — `— nuco` at root, `— nuco · loaf` inside a project, `— nuco · loaf · orders`
at a file. It's both the live indicator of where the cursor sits and a smoke alarm: if it stops
appearing, the client likely dropped the skill, so re-engage.
