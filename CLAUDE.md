# nuco (plugin repo) — agent guide

The real guide is **`plugins/nuco/CLAUDE.md`** — read it first. It is there because that is
the plugin's own directory; this root file exists only so that a session opened at the repo
root (or in a `.claude/worktrees/<slug>/`) auto-loads *something* and is sent to the right place.

Three things every session needs before reading further:

- **This is `lem4242/nuco-private`, the master.** `lem4242/nuco` is its public MIRROR,
  force-pushed from here for the marketplace — it has no ruleset by design; do not "fix" that.
- **When a doc disagrees with the code, the code wins — fix the doc in the same PR.** And
  **no agent-local memory**: durable knowledge goes in the repo, a nuco document, or a tooling
  guard. Both rules are spelled out in `plugins/nuco/CLAUDE.md`.
- **Coupled changes are one slug, two PRs.** The plan and decisions live in the sibling
  `nuco-core` under `plans/<slug>/`; the worktree here comes from `bin/stream link <slug>` run
  *there*. This repo has no `bin/stream` of its own on purpose — it carries plugin code only.
