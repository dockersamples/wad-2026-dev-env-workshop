# One file for the environment

> [!NOTE]
> **Picking up from module 2.** The `sessionboard` sandbox has your project
> kit added, and the kit itself is at
> :filelink[kits/sessionboard/spec.yaml]{path="kits/sessionboard/spec.yaml"}.

Right now your environment is a command with flags in it. Every flag you add
is a thing a teammate has to know, and every thing they have to know is a
thing they'll get wrong.

`sbxenv.yaml` moves it into a file you commit — the Compose-shaped experience,
for sandboxes.

Clear the decks first:

```bash terminal-id=host
sbx rm sessionboard -f
```

## Write the file

```yaml save-as=sbxenv.yaml
schemaVersion: "1"
name: sessionboard-dev
agent: claude

workspace:
  path: .

kits:
  - ./kits/sessionboard
  - docker.io/sbx/github-ssh-kit:latest

# Resolved on the HOST when the proxy needs them. The value never lands in
# this file, your shell history, or the sandbox.
secrets:
  github:
    command: gh auth token

# Which mechanisms and domains you've approved for each service.
bindings:
  github:
    apiKey:
      domains:
        - api.github.com
        - github.com

mcp:
  servers:
    - name: context7
      url: https://mcp.context7.com/mcp

ports:
  - sandbox: 3000
    host: 3000
    protocol: tcp4

sandboxOptions:
  cpus: 4
  memory: 8g
```

That's the whole environment: the agent, the workspace, the kits, the
credentials, the MCP servers, the ports, the machine size.

> [!IMPORTANT]
> Keep `sbxenv.yaml` **outside** the directories you mount, or directly in the
> workspace root. `sbx` mounts it read-only, but an environment file buried
> inside a writable workspace is one the agent can edit — and it declares
> commands that run on your host.
