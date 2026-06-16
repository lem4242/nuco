# nuco2 — Claude plugin marketplace

The marketplace for **nuco** — a shared, queryable store (documents + relational tables) on
ParadeDB, reached through an Obot composite. *Git for shared data and documents*, not a personal
notebook.

> Design rationale, decisions, schema, and phase plans live in a **separate** background repo —
> deliberately kept out of this distribution marketplace.

## What's here

| Plugin | What it is | Where |
| --- | --- | --- |
| `nuco` | The store: the `nuco` operating skill + the Obot composite MCP connector | `plugins/nuco/` |

```
.
├── .claude-plugin/
│   └── marketplace.json              # Declares the marketplace + lists plugins
├── plugins/
│   └── nuco/
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       ├── .mcp.json                 # Obot composite connect URL (per-user OAuth)
│       └── skills/
│           └── nuco/
│               └── SKILL.md          # The store operating skill (/nuco)
└── README.md
```

## The MCP endpoint

`plugins/nuco/.mcp.json` registers the Obot composite as a remote MCP server — no local process.
The connect URL is not a secret: Obot resolves per-user identity via OAuth on first connect, so
the config is all you need. (If the endpoint requires OAuth, Claude runs the flow in your browser
and stores the token securely.)

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

- **Toggle:** `/nuco on` engages the store and appends a status heartbeat to each reply;
  `/nuco off` stands down.
- **Skill:** "remember this", "save to nuco", "find in nuco", "what did we decide about…", or any
  nuco table work triggers the `nuco` skill.
- **MCP tools:** once connected (and authorized), the Postgres tools appear — check with `/mcp`.
