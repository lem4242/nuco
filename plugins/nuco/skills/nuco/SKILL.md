---
name: nuco
description: Use when the nuco shared store is engaged — capturing what the user points at ("remember this", "note that", "save where we got to", "write that up"), recalling past work ("what did we decide about…", "find memories about…", "what was that tool/lead time…"), the on/off toggle ("use nuco" / "nuco off" / "/nuco"), or relational-table work in the nuco2 ParadeDB store ("how's the wine selling", "load the export"). On "what did we…" questions, search the store BEFORE the web. Gate capture on engaged-state + explicit intent.
---

# nuco — shared store operating skill (capture & recall)

nuco is a **shared, queryable store** — *git for shared data and documents*. It holds what the
client can't: shared, durable, cross-context state. The durable primitive is the **document**
(append-only markdown in `doc`); ordinary **relational tables** hold quantitative data. Reached
through the Obot composite's Postgres MCP — always use the **lowest-permission** tool that works.

## On/off, engaged mode, heartbeat
- **Toggle (phrase OR slash — no slash is required):** "use nuco" / `/nuco on` engage; "nuco off" /
  `/nuco off` stand down. Every capability is reachable by natural phrase; slash is just a desktop
  shortcut.
- Engaging puts nuco into **engaged mode**: stay listening for capture/recall intent and **append a
  status line to every reply**: `— nuco · {role}`.
- **Discover your role, don't guess.** Run `select current_user;`; roles are `{store}_{role}` (e.g.
  `nuco2_editor` → `editor`). Take the segment after the last `_`. The store is the connection, so the
  heartbeat needs only the role.
- The heartbeat is a smoke alarm: if it stops, you've slipped out of context — re-engage. Never fake
  it; if `current_user` isn't `{store}_{role}`, say so.

## Capturing — point, don't type; you assign the state
The user **gestures**; **you** write the document and **assign its state**. The user never authors
store text and never picks a category. Live capture is dead simple: a whole document at one of
**three states** — never parse into facts/atoms in the moment (that's the deferred reflection layer).

- **`memory`** — a *snapshot*, captured unilaterally. "remember this", "note that", "don't let me
  forget". You write a short `summary` + the relevant material in `body`. The base state.
- **`draft`** — *presented but not yet agreed*. When you put up a write-up/proposal and it isn't
  accepted, save it `draft`. **Keep the negative space:** retain rejected drafts, **the feedback that
  killed them**, and the seed memory — the *why-not* is often worth more than the final doc.
- **`doc`** — *got broad agreement*. When the user agrees to a presented write-up, promote it.

**One idea = one `doc_key`, evolving by version (append-only).** A capture that advances the same
idea **continues that `doc_key`** (pass `in_doc_key` → next version); a genuinely new idea starts a
fresh one. So the trajectory **seed memory → draft(s) + feedback → agreed doc** is the version
history of one `doc_key`. Promotion/supersession = a new version with the new `state`; **record why a
draft was rejected as a line in the new version's `body`/`summary`** (cheap, in-context — don't
reconstruct later). Never `UPDATE` in place.

**Agree on digestible documents; split, don't atomise.** Keep what you present for agreement short
(≈ a page); if a thing is complex, split it into **several documents**, never into live atoms.

**Save (preferred one call):**
```
select * from nuco_save(in_state => 'memory'|'draft'|'doc', in_title => '…', in_body => '…',
  in_author => '<the user's identity>', in_summary => '…', in_doc_key => <uuid-to-continue-or-omit>);
```
Returns `out_doc_key, out_version`. A capable agent may write the raw append-only INSERT instead.

## Recalling (BM25 — ParadeDB, not vanilla Postgres)
- **Preferred one call:** `select * from nuco_search('your terms');` — current-only, **multi-signal
  ranked** (relevance × importance × recency: `doc > memory > draft`, recent over stale). Cap with
  `nuco_search('terms', 20)`.
- Importance demotes **drafts** on purpose: a rejected draft is elaborated, so it scores high on raw
  relevance — default recall must NOT surface it as authoritative. Drafts stay **low but findable**
  via the all-versions mode below ("why did we reject…").
- Raw modes (drop down only when the helper doesn't fit): **all-versions** (`@@@` on `doc`, no
  `doc_current` join — reaches superseded drafts) and **boost-latest**. Use `@@@`, **never**
  `LIKE`/`ILIKE`; `paradedb.score()` must reference the **base alias** `d`.
- The index stems **inflections** (flag/flagged/flagging) but NOT derivational variants
  (reconcile↔reconciliation) or compounds (rollback↔"roll back") — **expand the query** with the
  variants. Semantic/vector search is not enabled yet.

## Routing, stale data, provenance
- **Search the store FIRST** on "what did *we* decide/find" — only offer the web if nothing lands.
  Never silently web-search a "what did we…" question.
- **"remember this" with nuco off** → that's the client's own memory, not nuco. The heartbeat is the
  cue that a capture will persist and be shared.
- **Stale data:** don't say "I don't have it" — say *"sales last updated Tue 11pm — refresh, or work
  with what we've got?"*
- **Provenance:** answers from the store **cite the source document** (title · date · state), and say
  plainly when you're **inferring** vs **grounded** in a stored doc.

## Tables (the quantitative citizen)
- Aggregations/joins/comparisons/totals → **ordinary Postgres tables**, write the SQL directly. Don't
  reason numbers out of prose. You're the DBA: `EXPLAIN`/`EXPLAIN ANALYZE`, add indexes when slow.

## Discipline
- Confirm before destructive/irreversible writes. **Don't hoard every sentence** — explicit intent +
  the engaged toggle gate capture.
- If a write is denied, **narrate it** ("no editor access here") and offer the read path — don't crash
  or pretend it worked.
- **Atoms (facts/questions/actions), resurfacing open loops, contradiction-flagging are the reflection
  layer — deferred, not built. Do not extract them live.**
