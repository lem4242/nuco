#!/usr/bin/env node
/**
 * Hello World MCP server.
 *
 * A minimal, dependency-free Model Context Protocol server that speaks the
 * stdio transport: newline-delimited JSON-RPC 2.0 messages over stdin/stdout.
 *
 * It exposes a single tool, `say_hello`, which returns a friendly greeting.
 * This is intentionally tiny so it's easy to read as an example.
 */

"use strict";

const PROTOCOL_VERSION = "2024-11-05";

const SERVER_INFO = {
  name: "hello-world",
  version: "0.1.0",
};

const TOOLS = [
  {
    name: "say_hello",
    description:
      "Return a friendly greeting. Optionally greet a specific person by name.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Who to greet. Defaults to 'world'.",
        },
      },
      required: [],
    },
  },
];

/** Write a single JSON-RPC message to stdout, newline-delimited. */
function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

/** Build a JSON-RPC success response. */
function result(id, value) {
  return { jsonrpc: "2.0", id, result: value };
}

/** Build a JSON-RPC error response. */
function error(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function handleToolCall(params) {
  const toolName = params && params.name;
  const args = (params && params.arguments) || {};

  if (toolName === "say_hello") {
    const who =
      typeof args.name === "string" && args.name.trim() !== ""
        ? args.name.trim()
        : "world";
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${who}! 👋 (from the hello-world MCP server)`,
        },
      ],
    };
  }

  return null; // unknown tool
}

function handleMessage(msg) {
  // Notifications have no `id` and expect no response.
  const isNotification = msg.id === undefined || msg.id === null;

  switch (msg.method) {
    case "initialize":
      send(
        result(msg.id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        })
      );
      return;

    case "notifications/initialized":
    case "initialized":
      // Client confirming initialization — nothing to reply.
      return;

    case "ping":
      send(result(msg.id, {}));
      return;

    case "tools/list":
      send(result(msg.id, { tools: TOOLS }));
      return;

    case "tools/call": {
      const toolResult = handleToolCall(msg.params);
      if (toolResult === null) {
        send(
          error(
            msg.id,
            -32602,
            `Unknown tool: ${msg.params && msg.params.name}`
          )
        );
      } else {
        send(result(msg.id, toolResult));
      }
      return;
    }

    default:
      // Respond with method-not-found for requests; ignore unknown notifications.
      if (!isNotification) {
        send(error(msg.id, -32601, `Method not found: ${msg.method}`));
      }
      return;
  }
}

// --- stdin reader: split incoming bytes into newline-delimited JSON ---

let buffer = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (line === "") continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch (e) {
      // Can't parse — we don't know the id, so emit a generic parse error.
      send(error(null, -32700, "Parse error"));
      continue;
    }
    try {
      handleMessage(msg);
    } catch (e) {
      if (msg && msg.id !== undefined && msg.id !== null) {
        send(error(msg.id, -32603, `Internal error: ${e.message}`));
      }
    }
  }
});

process.stdin.on("end", () => process.exit(0));
