# nuco2 — Claude plugin marketplace

The marketplace for **nuco** — a shared, queryable store (documents + relational tables) on
ParadeDB, served by a self-hosted MCP server. *Git for shared data and documents*, not a personal
notebook.

> Design rationale, decisions, schema, and phase plans live in a **separate** background repo —
> deliberately kept out of this distribution marketplace.

## What's here

| Plugin | What it is | Where |
| --- | --- | --- |
| `nuco` | The store: the `nuco` operating skill + the self-hosted MCP connector | `plugins/nuco/` |

```
.
├── .claude-plugin/
│   └── marketplace.json              # Declares the marketplace + lists plugins
├── plugins/
│   └── nuco/
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       ├── .mcp.json                 # Self-hosted MCP server URLs (per-user OAuth)
│       └── skills/
│           └── nuco/
│               └── SKILL.md          # The store operating skill (/nuco)
└── README.md
```

## The MCP endpoint

`plugins/nuco/.mcp.json` registers two self-hosted MCP servers — `nuco` (data plane) and
`nuco-admin` (control plane) — as remote MCP servers, no local process. The URLs are not secrets:
the server resolves per-user identity via WorkOS AuthKit OAuth on first connect, so the config is
all you need. Claude runs the OAuth flow in your browser and stores the token securely.

## Install

### Organization (Claude app / Cowork)

1. **Organization settings → Plugins**
2. **Add plugin → GitHub**, enter `lem4242/nuco2`.
3. An initial sync runs; optionally enable **⋯ → "Sync automatically"**.

Members then open **Customize → Plugins** and install **nuco** — no per-user GitHub login.
(Requires a Team/Enterprise plan; the repo must be private/internal on github.com; plugins use
relative-path sources, which this repo does.)

### Claude Code (individuals)

```
/plugin marketplace add lem4242/nuco2
/plugin install nuco@nuco2
```

Or browse with `/plugin`. (Private-repo note: Claude Code clones locally per machine, so each
user needs their own git read access.)

### Try locally before pushing

```
/plugin marketplace add /path/to/nuco2
/plugin install nuco@nuco2
```

## Use it

- **Wake:** `/nuco` wakes the store, shows where you are, and appends a status heartbeat to each
  reply; it stays woken until context drops it (the heartbeat stops) or you run `/nuco off`.
- **Skill:** "remember this", "save to nuco", "find in nuco", "what did we decide about…", or any
  nuco table work triggers the `nuco` skill.
- **MCP tools:** once connected (and authorized), the Postgres tools appear — check with `/mcp`.
