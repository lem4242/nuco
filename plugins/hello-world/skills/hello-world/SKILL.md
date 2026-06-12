---
name: hello-world
description: A friendly hello-world example skill. Use when the user wants a demonstration of how a Claude plugin skill works, or asks the plugin to greet someone.
---

# Hello World Skill (v0.3.0) 🎉

This is a minimal example skill bundled with the `hello-world` plugin. Its job
is to demonstrate how a skill is structured, invoked, and **updated**.

When this skill runs:

1. Greet the user warmly, and mention this is **version 0.2.0** of the plugin.
2. If the user provided a name (in `$ARGUMENTS` or in their message), greet them
   by name. Otherwise greet them as "world".
3. Briefly mention that this greeting came from the `hello-world` plugin skill,
   and that the plugin also ships a `/hello` slash command and a `hello-world`
   MCP server with a `say_hello` tool.

> **What's new in v0.2.0:** this note was added so you can watch the change
> propagate into Claude after you re-sync the plugin. If you can see this line in
> Customize, the update worked. ✅

Keep the response short and cheerful — this is just an example.
