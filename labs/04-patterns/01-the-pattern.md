# Devcontainers, taken seriously

Put the last three modules together and you get an environment that has
nothing to do with your local machine except a browser tab.

1. A **github-clone** kit clones the repo inside the sandbox at create time,
   using a proxy-managed `GH_TOKEN` — the real token stays on your host.
2. Your **project kit** installs tooling and starts the Compose stack.
3. The **code-server** kit runs VS Code on port 8080, opened on the workspace,
   with the Claude Code extension already installed.
4. **github-ssh** and **git-ssh-sign** make push and signed commits just work,
   with the signing key never leaving your host's SSH agent.
5. Ports 3000 and 8080 are published from the start.

Update `sbxenv.yaml`:

```yaml save-as=sbxenv.yaml
schemaVersion: "1"
name: sessionboard-dev
agent: claude

# Mountless: nothing from the host is shared. The clone happens inside.
kits:
  - source: ./kits/github-clone
    args:
      repo: wearedevelopers/sessionboard
      dir: /home/agent/workspace
  - ./kits/sessionboard
  - docker.io/sbx/code-server-kit:latest
  - docker.io/sbx/github-ssh-kit:latest
  - docker.io/sbx/git-ssh-sign-kit:latest

secrets:
  github:
    command: gh auth token

bindings:
  github:
    apiKey:
      domains:
        - api.github.com
        - github.com

ports:
  - sandbox: 3000
    host: 3000
    protocol: tcp4
  - sandbox: 8080
    host: 8080
    protocol: tcp4

sandboxOptions:
  cpus: 4
  memory: 8g
```

```bash terminal-id=host
sbx env run
```

Both ports come up published, because the file said so:

```bash terminal-id=host
sbx ports sessionboard-dev
```

Open **http://localhost:8080** and you're in VS Code — running inside the
microVM, on a clone of the repo, with the stack already up and Claude Code in
the sidebar talking to the same credentials. Check the API is answering
through the published port:

```bash terminal-id=host
curl http://localhost:3000/healthz
```

The agent you drive from that browser tab is running *inside* the sandbox. It
gets the full boundary — its own kernel, its own daemon, deny-by-default
egress, credentials it can't read — and you get an editor.

Nothing is installed on your laptop. Onboarding is `sbx env run`.

> [!TIP]
> Heavy, slow-changing tooling belongs in a **template** image rather than a
> kit — kits re-run their install commands on every recreate, and you'll be
> recreating often. A thick template plus thin kits is the fast combination.
