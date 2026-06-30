---
name: nuco
description: Use when the nuco shared store is woken — capturing what the user points at ("remember this", "note that", "write that up"), recalling past work ("what did we decide about…", "find the memory on…"), navigating the store ("show me where I am", "switch project", "list tables"), or working with shared tables. On "what did we…" questions, search nuco BEFORE the web. Capture only on explicit intent.
---

# nuco — shared-memory operating judgment

nuco is the team's shared, durable store: append-only **documents** (prose) and **tables**
(structured data), organised into **projects**. The tools tell you how to call them — `nuco_context`
first, `project` to target a scope, `doc_*` for prose, `db_*` for tables. This skill is how to do it
well. The line that matters: your client's memory is private and ephemeral; nuco is shared and
durable. Put something here when it must outlive this chat, be seen by a colleague, or be read by a
later job — keep everything else in the client.

## Capturing — the user gestures, you author

The user points ("remember this", "write that up"); you compose the document and pick its **state**
by where the idea is (one axis):

- **saved** — captured, not yet relied on. The default: a working note, a proposal, a snapshot.
- **active** — current and in force. `state = active` means "rely on this".
- **archived** — retired or superseded.

Also **required**: a free-text `type` (lower-case, ≥3 chars) for *what kind* of doc — `note` (default),
`memory`, `decision`, `spec`… orthogonal to state; you can narrow recall by it (`type:"decision"`).
`summary` is the subtitle — a one-line description, not a restatement of the title.

One idea = one `doc_key`, advanced by version (pass the existing key to move it forward; saved→active
is just version history). Append-only: when a proposal is rejected, save the next version with the
*why-not*, don't delete — the killed reasoning is often worth more later. Keep docs digestible
(~a page); split a big thing into several rather than one sprawl.

## Recalling — store first, cite always

- On "what did we decide / find / agree", **search nuco before the web**; only fall back if nothing
  lands. Search `state:"active"` first, then broaden.
- **Cite provenance** — title · state · date; say plainly whether you're grounded in a doc or inferring.
- **Stale data**: don't say "I don't have it" — say when it was last updated and offer to use or refresh it.

## Routing — private by default, shared on purpose

Omitting `project` keeps a write in your personal project (private — the safe default). Name a shared
project for anything a colleague or job must see. The write tells you where it landed — surface that,
and surface denials ("no write access there — here's the read path"); never pretend a denied write worked.

## Numbers live in tables

Totals, joins, comparisons → tables with SQL; don't reason figures out of prose. You're the DBA:
inspect with `db_describe`, `dry_run` before big changes, add indexes if slow.

## Rendering — navigable status screens

nuco is a shell. An ambient **cursor** persists between messages at **root / project / file**.
`/nuco` (or "show me", "ls") renders the **current level**; naming a child is `cd`, a back-link `cd ..`.
**Always markdown, never a widget.** One call paints each view (named below).

**Glyphs** (monochrome unicode; the only HTML is `<br>`): `☲` docs · `⛁` tables · `◰` assets · `⇄`
connectors · `◷` updated · `⤓` size · `✎` access · `⚑` state. Access cells: `⌂` home · `rw` write ·
`r` read. State cells: `✓` active · `○` saved · `✗` archived · `→` superseded. Time abbreviated
(`2 mins` · `3 hrs` · `4 days` · `2 wks` · `5 mos`).

**Rules.** First column + free-text columns left; number / glyph columns centred. Capitalise headings
and text headers; leave raw DB identifiers (table & column names) verbatim. State is a **glyph** in
tables, spelled out only in a doc's own meta line. Degrade an empty value → `—`, a true-zero count →
`0`. The heading carries the full path as **names**; the heartbeat shows only the project.

**root** (`nuco_context`) — one row per project; the Project cell stacks **Name** / description / members:

| Project | ☲ | ⛁ | ◷ | ✎ |
|:--|:-:|:-:|:-:|:-:|
| **Monicavinader**<br>Demi-fine jewellery research<br>lynton@vivelia.co.uk, lynton@d3r.com | 44 | 3 | 2 days | rw |

**project home** (`nuco_context(project=…)`) — a section index, not full lists. `# <Name>` (your home →
`# ⌂ Home`); the `_description_` on its own paragraph; then `✎ Access: read + write | ◷ Updated 2 days`
(drop the pencil when read-only); then the sections (blank header row), glyph beside the count:

| | |
|:--|:-:|
| **Documents**<br>19 note · 16 findings · +9 | ☲ 44 |
| **DB**<br>competitor_matrix · competitor_pricing | ⛁ 3 |
| **Assets**<br>4 pdf · 2 png | ◰ 6 |
| **Connectors**<br>none | ⇄ 0 |
| **Members**<br>lynton@vivelia.co.uk, lynton@d3r.com | |

**section views** (drill-in) — the full list for one section:

- **Documents** (`doc_search`) → `| Document | Type | ◷ | ⚑ |`; cell stacks **Title** `vX` / subtitle.
  A type-scoped list (`cd docs/<type>`) drops the Type column. **Search** renders the same, filtered.
- **Tables** (`db_describe`) → `| Table | Rows |`; names plain; hide `doc` / `nuco_audit`.
- **Assets** (`file_list`) → `| Asset | ⤓ | ◷ |`; name links to its `webViewLink`; sizes compact
  (`2.4Mb` · `12Kb` · `340b`); empty → _No assets yet_.

| Document | Type | ◷ | ⚑ |
|:--|:-:|:-:|:-:|
| **Competitor review (8 brands)** v3<br>Benchmark vs 8 demi-fine brands | note | 2 days | ✓ |

**file views** — `cd <doc|table>`:

- **document** (`doc_read`) — `## <Title>`, a meta line `note · v3 · ✓ active · ◷ 2 days`, then the
  **body rendered as markdown**.
- **table** (`db_read` + `db_describe`) — a markdown table by the rules above; `date` absolute, `since`
  relative, `status` the plain word, rich cells fall back to raw text. Cap 500 rows; show the count and
  whether it `truncated`.

## Usage notes that bite

- `where` takes `{"col": v}` (eq), `{"col": [a,b]}` (in), or `{"col": {"op":"gte","value":100}}` (the
  operator object needs **both** literal keys; `{"col":{"gte":100}}` is rejected). Ops: eq/ne/lt/lte/gt/gte/in/is_null.
- Numeric columns come back as **strings** (`"620.00"`) — no naive math.
- Reads cap at 500 rows (`truncated:true`); `limit` only *lowers* that. Bigger → aggregate/paginate in SQL.
- Search stems inflections (flag↔flagged) but not derivational/compound variants — expand the query
  yourself. It ranks by relevance + state (active boosted, archived demoted but still findable); an
  unfiltered hit isn't authoritative until you check its `state`.

## Discipline

- Confirm before destructive/irreversible writes; capture on explicit intent while woken, not every
  sentence; surface denials, never fake a write.
- **Heartbeat:** once woken, end **every reply** with a one-line heartbeat showing only the current
  project — `— nuco` at root, `— nuco · <project>` inside one (at any depth; the heading carries the
  rest). It's a smoke alarm: if it stops, context dropped the skill — re-run `/nuco`. Keep it up until
  context drops the skill or the user says `nuco off`.
