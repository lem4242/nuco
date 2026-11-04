---
name: nuco-memory
description: Use at the start of a session with nuco connected, and whenever the person says "remember …", states a fact, preference or decision about themselves, their people, projects or places, or asks "what did I say about …" / "what do I prefer …". Personal memory lives in nuco (memory_read, memory_add), scoped to the person's own identity; in a coding session read it at the start and write only on explicit intent.
---

# nuco-memory — the person's own memory, kept in nuco

nuco holds the person's personal memory as one-sentence rows (`fact`, `decision`, `open`, `idea`),
scoped by their verified identity: no `project` argument, and no one else can read them. The verbs exist
only where the deployment has `NUCO_MEMORY` on; if `memory_read` is not in your tool list, memory is not
enabled there — say so once and carry on without it.

## Read at the start

Call `memory_read` once at the start of a session. A plain read returns the generated profile
body and active open items. `profile.written_at` says when that profile version was written;
`profile.pending_facts` counts qualifying current facts changed since that version and not yet
reflected in it. When the count is nonzero, `profile.freshness` explains the lag and points to a
query read for those facts now. If no profile exists yet but qualifying facts are pending,
`written_at` is null and the freshness message says it has not yet been written. Do not treat
the profile as fully current while facts are pending.

For work about a person, project or place use
`memory_read(query="<subject>")`: it matches text, source quotes, subject names and aliases,
returning open items first, then rows grouped by subject, with a profile reference rather than
its body. Subject groups and subject-bearing open items include `subject_kind` (person,
project, place, topic, area or asset); use that supplied kind rather than inferring it from a name.
Rows without a subject have no subject kind. Responses are bounded; `omitted > 0` means rows were left out — narrow `query`.
Use what it says; don't recite it.

## Recall

- "What did I say about X?" → `search` with `query: "X", kind: "memory"` (no `project` needed) when it is in
  your tool list, else `memory_read(query="X")`. Cite the row's sentence, not your paraphrase.
- "What did I say before / used to think?" → `memory_read` with `history: true` (superseded, retired,
  stale and parked rows with their interval) or `at: "<ISO time>"` (what held then).

## Write

- **Coding sessions (Claude Code, Codex): write only on explicit intent** — "remember that …",
  "note that I …". Learnings about a codebase and ideas for it go to the repository (its CLAUDE.md, docs
  or ideas), never to personal memory.
- **Chat sessions:** when the person says "remember", or states a fact, preference, decision or open
  question about themselves or their people, projects and places, call `memory_add`.
- Every `fact` and `decision` carries `source_quote`: the person's own sentence, verbatim. Never record
  your own inference, summary or suggestion as a fact or decision; if it isn't something they said,
  it isn't a fact. Something floated and not chosen is an `idea`; something unresolved is `open`.
- One sentence per row; name the `subject` by its plain name (the verb resolves names and aliases —
  never invent an id).
- A correction is a new row with `replaces: <id>` of the row you read; never write a duplicate beside
  the old one.
- A `decision` whose quote does not show the person deciding may come back as `open`: nuco checks
  decisions against their quotes. Don't argue with it; ask the person if it matters.

## Client memory off

Personal memory has one home. Don't write the client's own memory store:
- **Claude Code**: auto-memory stays off (this plugin's rule, `CLAUDE.md` "No agent-local memory").
- **Codex**: set `memories.generate_memories = false` and `memories.use_memories = false` in
  `~/.codex/config.toml`.
- **Claude.ai / ChatGPT**: the account's own memory is the person's choice; nuco's is the one these
  verbs read and write.
