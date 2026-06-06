# nuco2 — Hello World Claude plugin marketplace

A tiny [Claude Code plugin](https://code.claude.com/docs/en/plugins) example you
can install into your own Claude. It contains one marketplace with one plugin,
`hello-world`, which demonstrates three common plugin components:

| Component   | What it is                              | Where it lives                                          |
| ----------- | --------------------------------------- | ------------------------------------------------------- |
| Skill       | Model-invokable instructions            | `plugins/hello-world/skills/hello-world/SKILL.md`       |
| Command     | A `/hello` slash command                | `plugins/hello-world/commands/hello.md`                 |
| MCP server  | A remote MCP endpoint (HTTP + OAuth)    | `plugins/hello-world/.mcp.json`                         |

## Repository layout

```
.
├── .claude-plugin/
│   └── marketplace.json          # Declares the marketplace + lists plugins
├── plugins/
│   └── hello-world/
│       ├── .claude-plugin/
│       │   └── plugin.json        # Plugin manifest
│       ├── .mcp.json              # Points at the remote MCP endpoint
│       ├── commands/
│       │   └── hello.md           # /hello slash command
│       └── skills/
│           └── hello-world/
│               └── SKILL.md        # Example skill
└── README.md
```

## The MCP endpoint

This plugin registers an **external (remote) MCP server** — there's no local
process to run. The connection is declared in
`plugins/hello-world/.mcp.json`:

```json
{
  "mcpServers": {
    "hello-world": {
      "type": "http",
      "url": "https://example.com/mcp"
    }
  }
}
```

- `type: "http"` is the streamable-HTTP remote transport.
- Replace the placeholder `url` with your real endpoint.
- **OAuth:** if the endpoint requires OAuth, you don't put any secret in this
  file. The first time Claude connects, it runs the OAuth flow in your browser
  and stores the token securely. So the config above is all you need.

## Install it into Claude

In Claude Code, add this repo as a marketplace and install the plugin:

```
/plugin marketplace add lem4242/nuco2
/plugin install hello-world@nuco2
```

Or browse interactively with:

```
/plugin
```

### Try it locally before pushing

You can point Claude at a local checkout instead of GitHub:

```
/plugin marketplace add /path/to/nuco2
/plugin install hello-world@nuco2
```

## Use it

- **Slash command:** type `/hello` (or `/hello Ada`) to get a greeting.
- **Skill:** ask Claude something like "use the hello-world skill to greet me".
- **MCP tools:** once the endpoint is reachable (and authorized), its tools
  appear automatically — check them with `/mcp`.

## Make it your own

1. Rename the plugin in `plugins/hello-world/.claude-plugin/plugin.json` and the
   marketplace entry in `.claude-plugin/marketplace.json`.
2. Edit `SKILL.md` to give your skill a real job.
3. Set the real endpoint `url` in `plugins/hello-world/.mcp.json`.
