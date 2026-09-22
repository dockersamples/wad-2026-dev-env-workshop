# The AI-Ready Developer Environment

Your development environment used to be a language runtime, a database, and a
README that was wrong. Now it also has an agent harness, agent-specific
tooling, MCP servers, credentials for half a dozen services, and a colleague
whose setup drifted three weeks ago.

Over four modules you'll build an environment that handles all of it — and
that a teammate can start with one command. This is module 1.

## What you'll work on

**SessionBoard** is a small app for rating talks at WeAreDevelopers: an Express
API, a Postgres database, and a Compose file.

:filelink[compose.yaml]{path="compose.yaml"} ·
:filelink[api/server.js]{path="api/server.js"}

It's deliberately ordinary. The interesting part is everything *around* it.

## Where you'll end up

Each module is a short deck followed by a lab like this one. They pick up from
each other, so the sandbox you start here is the one module 2 customizes.

| Module | You'll build |
| --- | --- |
| **1 — you are here** | An agent running in a sandbox, with a trust boundary you can watch enforce itself |
| 2 | A kit that installs your project's tools and starts its Compose stack |
| 3 | An `sbxenv.yaml` that turns all of it into one command |
| 4 | The full pattern: clone, code-server in the browser, agent inside |

## About this terminal

Every command here is the real thing — same flags, same output. The terminal is
scripted so that nobody needs an API key, a subscription, or a working network
to follow along, and so we all see the same result at the same moment.

To do this on your own machine afterwards, you need `sbx` **0.45.0 or later**:

> [!NOTE]
> **Install and set up `sbx`:** follow
> [docs.docker.com/ai/sandboxes/install](https://docs.docker.com/ai/sandboxes/install/),
> then `sbx login`. Everything in this lab works the same there.

Two tabs on the right: **Your machine** is where `sbx` commands go, and
**Agent session** is where you'll be attached to Claude. Keeping them separate
is the whole trick here — you'll change what the agent can reach from the
other tab, while it's running. Later modules only need the one terminal.

Start with `sbx version` to check you're on the right release:

```bash terminal-id=host
sbx version
```
