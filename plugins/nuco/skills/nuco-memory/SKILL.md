---
name: nuco-memory
description: Use at session start with nuco connected and for personal recall or remembering facts, preferences and decisions. In coding sessions, read at the start and write only on explicit intent.
---

# Personal memory

If `memory_read` is available, read once at session start, including coding sessions. Use the
profile without reciting it. When `pending_facts` is nonzero, query relevant subjects before
relying on the profile, even if no profile has been written yet. Use supplied `subject_kind`,
not a guess from the name.

For "what did I say about X?", search with `kind="memory"` (or `memory_read(query="X")` if search
is unavailable); cite the row's sentence. For earlier views use `history` or `at`.

In coding sessions, write only on explicit intent ("remember that"). Codebase learnings and
ideas go in the repository. In chat, follow the server's standing capture instructions. Never
record your own inference or suggestion as the person's fact or decision. Something floated
but unchosen is an `idea`; unresolved is `open`. `memory_add` needs `kind` (`fact`, `decision`, `open` or `idea`). A correction passes the row's
`memory_id` as `replaces` rather than adding a duplicate. Accept a decision downgraded to open; ask the person if it matters.

Don't write client auto-memory. In Codex, disable `memories.generate_memories` and
`memories.use_memories`; Claude Code's auto-memory stays off. Account memory in Claude.ai or
ChatGPT remains the person's choice.
