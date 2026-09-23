# What applies when

You have a working environment. Now change it — that's the part that bites.

Add the code-server kit and its port to
:filelink[sbxenv.yaml]{path="sbxenv.yaml"}. You'll want both in module 4
anyway:

```yaml save-as=sbxenv.yaml highlight=11-12
schemaVersion: "1"
name: sessionboard-dev
agent: claude

workspace:
  path: .

kits:
  - ./kits/sessionboard
  - docker.io/sbx/github-ssh-kit:latest
  # VS Code in the browser, on port 8080.
  - docker.io/sbx/code-server-kit:latest

secrets:
  github:
    command: gh auth token

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
  # …and the port it listens on.
  - sandbox: 8080
    host: 8080
    protocol: tcp4

sandboxOptions:
  cpus: 4
  memory: 8g
```

Saved. Now apply it the way you'd expect to:

```bash terminal-id=host
sbx env run
```

Read that note. Nothing happened.

## `sbx env run` is not `docker compose up`

This is the single most common surprise, and it's worth internalising before
you hit it in front of a colleague. Against an environment that **already
exists**, `sbx env run` reconciles almost nothing:

| Field | When it takes effect |
| --- | --- |
| `env` | Every `run` — applied to the new agent session |
| `mcp.servers` | Every `run` — reconciled against the sandbox |
| `kits` | **Creation only** |
| `ports` | **Creation only** |
| `workspace`, `additionalWorkspaces` | **Creation only** |
| `secrets`, `bindings`, `registries` | **Creation only** |
| `sandboxOptions` | **Creation only** |

The reason is the same one from module 2: a kit's install commands run once,
as root, when the VM is built. There is no safe way to retrofit a new kit,
a new mount, or more RAM into a machine that's already running — so `sbx`
doesn't pretend to.

## So you recreate

```bash terminal-id=host
sbx env rm
```

Note that `rm` shows you a plan too, and asks. It names the sandbox and every
resource going with it, so a destroy is never a surprise either.

From here `sbx env run` would build the environment fresh, with code-server
and port 8080 included. **Leave it torn down** — module 4 changes this file
again before rebuilding it, and recreating twice just costs you time.

> [!TIP]
> Recreating is cheaper than it sounds. The template image is cached, so the
> only real cost is re-running each kit's install commands.

## Which is an argument about where things live

You'll recreate often, so what you put in a kit versus an image starts to
matter:

| | Runs | Put here |
| --- | --- | --- |
| **Template** (an image) | Built once, ahead of time | Language toolchains, system packages, anything slow and stable |
| **Kit** (YAML) | Install commands on every create | Project config, credentials, network rules, startup commands |

A thick template with thin kits recreates in seconds. A thin template with a
kit that compiles something takes a coffee break, every single time.

> [!NOTE]
> Two ways to avoid a full recreate while you're iterating. For a **kit**,
> `sbx kit add` still works on a running sandbox — limited to
> `environment.variables`, `setup.install`, and `permissions.network.allow`,
> as in module 2. For a **port**, `sbx ports <sandbox> --publish 8080:8080`
> publishes one directly. Both are for the edit-test loop; the environment
> file is still the thing you commit.

---

One file, one command, same result for everyone. The environment is torn down
and ready to be rebuilt with whatever you change next.

**Next:** slides for module 4, then the **Patterns, tradeoffs, and what's
next** lab.
