# What a kit is

> [!NOTE]
> **Picking up from module 1.** A sandbox called `sessionboard` is already
> running with the API's port published, and the `/healthz` route the agent
> added is in :filelink[api/server.js]{path="api/server.js"}. Everything below
> runs on **Your machine**, not inside the agent session.

A bare sandbox is a boundary, not an environment. Something still has to say
which tools are inside, which services it may reach, which credentials it may
spend, and what the agent should know about your project.

A **kit** is that something: a `spec.yaml`, optionally with a `files/`
directory, applied when the sandbox is created.

## What a kit can declare

| Block | What it does |
| --- | --- |
| `args` | Inputs the kit takes, so one kit serves several projects |
| `setup.install` | Commands run **once**, at creation |
| `setup.startup` | Commands run at **every start** — must be idempotent |
| `setup.files` | Files written at startup, with runtime values substituted |
| `files/home/`, `files/workspace/` | Static files bundled with the kit |
| `permissions.network` | `allow` / `deny` rules, scoped to sandboxes using this kit |
| `credentials` | A service, its in-VM variable, and where the proxy may spend it |
| `environment.variables` | Plain env vars (never secrets — the VM can read these) |
| `ports` | Ports the kit's services listen on |
| `agentInstructions` | Markdown appended to the agent's memory file |

Two kinds:

- **`kind: mixin`** — extends an existing agent. Stack as many as you like.
- **`kind: sandbox`** — defines a whole agent: its image, its entrypoint,
  everything. This is how you ship a custom or forked agent.

> [!NOTE]
> Today's shipping format (`schemaVersion: "2"`) calls them `sandbox` and
> `mixin`. The [v3 spec](https://github.com/docker/sandbox-kit-spec) renames
> `sandbox` to `workload` and packages a kit as a plain OCI image. More on
> that at the end.

## Look at a real one

`code-server` runs VS Code in the browser inside the sandbox. It's published
to Docker Hub, like every kit in
[docker/sbx-kits-contrib](https://github.com/docker/sbx-kits-contrib):

```bash terminal-id=host
sbx kit inspect docker.io/sbx/code-server-kit:latest
```

Eight network allow rules — every host `code-server`'s installer touches, and
nothing else. That's the shape to copy: a kit asks for exactly the egress its
install path needs, and that ask is right there in the file where you can read
it before you run it.
