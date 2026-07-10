# nuco — Claude plugin marketplace

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
│       ├── CLAUDE.md                 # Agent guide for the nuco plugin
│       ├── commands/
│       │   ├── nuco.md
│       │   ├── nuco-project.md
│       │   ├── nuco-search.md
│       │   └── nuco-db.md
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

### Claude Code (individuals)

```
/plugin marketplace add lem4242/nuco
/plugin install nuco@nuco
```

Or browse with `/plugin` — no git auth to set up; Claude Code clones the marketplace locally
per machine.

### Organization (Claude app / Cowork)

Add `lem4242/nuco` under **Organization settings → Plugins → Add plugin → GitHub**, then optionally
enable **⋯ → "Sync automatically"**; members install **nuco** from **Customize → Plugins** with no
per-user GitHub login. (Orgs that require a private/internal plugin source point at their own private
copy of this marketplace instead — see the internal onboarding runbook.)

### Try locally before pushing

```
/plugin marketplace add /path/to/nuco
/plugin install nuco@nuco
```

## Use it

- **Wake:** `/nuco` wakes the store, shows where you are, and appends a status heartbeat to each
  reply; it stays woken until context drops it (the heartbeat stops) or you run `/nuco off`.
- **Skill:** "remember this", "save to nuco", "find in nuco", "what did we decide about…", or any
  nuco table work triggers the `nuco` skill.
- **Commands:**
  - `/nuco` — wake the store and show the current project status.
  - `/nuco-project` — switch to a project and render its home, or list projects.
  - `/nuco-search` — search the nuco store (docs + files) and render the results.
  - `/nuco-db` — work with relational tables in the current project.
- **MCP tools:** once connected (and authorized), the nuco tools appear — check with `/mcp`.
