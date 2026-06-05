# nuco2 — Hello World Claude plugin marketplace

A tiny [Claude Code plugin](https://code.claude.com/docs/en/plugins) example you
can install into your own Claude. It contains one marketplace with one plugin,
`hello-world`, which demonstrates the three most common plugin components:

| Component   | What it is                              | Where it lives                                          |
| ----------- | --------------------------------------- | ------------------------------------------------------- |
| Skill       | Model-invokable instructions            | `plugins/hello-world/skills/hello-world/SKILL.md`       |
| Command     | A `/hello` slash command                | `plugins/hello-world/commands/hello.md`                 |
| MCP server  | A `say_hello` tool over stdio           | `plugins/hello-world/mcp-server/index.js` + `.mcp.json` |

## Repository layout

```
.
├── .claude-plugin/
│   └── marketplace.json          # Declares the marketplace + lists plugins
├── plugins/
│   └── hello-world/
│       ├── .claude-plugin/
│       │   └── plugin.json        # Plugin manifest
│       ├── .mcp.json              # Declares the bundled MCP server
│       ├── commands/
│       │   └── hello.md           # /hello slash command
│       ├── skills/
│       │   └── hello-world/
│       │       └── SKILL.md        # Example skill
│       └── mcp-server/
│           └── index.js           # Dependency-free MCP stdio server
└── README.md
```

## Install it into Claude

> Requires Node.js on your PATH (the MCP server runs with `node`).

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
- **MCP tool:** ask Claude to "call the say_hello tool", or use it directly —
  it accepts an optional `name` argument.

## Test the MCP server by hand

The server speaks newline-delimited JSON-RPC over stdio. You can drive it
manually to confirm it works:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"say_hello","arguments":{"name":"Ada"}}}' \
  | node plugins/hello-world/mcp-server/index.js
```

You should see three JSON responses, the last containing
`Hello, Ada! 👋`.

## Make it your own

1. Rename the plugin in `plugins/hello-world/.claude-plugin/plugin.json` and the
   marketplace entry in `.claude-plugin/marketplace.json`.
2. Edit `SKILL.md` to give your skill a real job.
3. Add tools to `mcp-server/index.js` (extend the `TOOLS` array and the
   `say_hello` branch in `handleToolCall`).
