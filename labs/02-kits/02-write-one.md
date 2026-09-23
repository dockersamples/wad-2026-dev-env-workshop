# Write one for your project

The highest-value kit is usually the boring one that lives in your own repo:
install what this project needs, allow what this project talks to, start the
stack, and tell the agent how things work here.

Save this as `kits/sessionboard/spec.yaml`:

```yaml save-as=kits/sessionboard/spec.yaml
schemaVersion: "2"
kind: mixin
name: sessionboard
displayName: SessionBoard project setup
description: Node tooling, the Compose stack, and project conventions for SessionBoard.

permissions:
  network:
    allow:
      - registry.npmjs.org
      - deb.debian.org

ports:
  - sandbox: 3000
    protocol: tcp

setup:
  install:
    - command: npm ci --prefix /home/agent/workspace/api
      user: "1000"
      description: Install API dependencies once, at sandbox creation
    - command: apt-get update && apt-get install -y --no-install-recommends postgresql-client
      user: "0"
      description: psql, for poking at the database directly

  startup:
    - command: ["docker", "compose", "up", "-d"]
      user: "1000"
      background: true
      description: Bring the SessionBoard stack up on every sandbox start

agentInstructions:
  content: |
    ## SessionBoard

    The stack is already running — `docker compose up -d` runs at sandbox
    start. The API is on port 3000 and Postgres is reachable as `db:5432`.

    - Run the tests with `npm test --prefix api`. Always run them before
      saying a change is done.
    - Migrations live in `db/migrations/`. Never edit an applied migration;
      add a new one.
    - `psql $DATABASE_URL` is available if you need to inspect data.
```

Two details that matter more than they look:

**`install` vs `startup`.** Installing runs once and is baked into the VM.
Starting runs every time the sandbox starts, so it must be safe to run twice —
`docker compose up -d` is, `docker compose up` isn't.

**`agentInstructions`.** A mixin's content lands in
`kits-memory/sessionboard.md` next to the agent's memory file, and the memory
file gets a `## Kits` section pointing at it. Every teammate's agent now knows
your test command and your migration rule, because it ships with the
environment instead of living in someone's head.

Check it:

```bash terminal-id=host
sbx kit validate ./kits/sessionboard
```

## Parameterize it

That kit hardcodes `/home/agent/workspace`, which is fine until the second
project wants it. A top-level `args:` block turns a hardcoded value into an
input, referenced anywhere in the spec as `${{ kit.args.<name> }}`:

```yaml no-run-button
args:
  dir:
    default: "/home/agent/workspace"
    description: Path to the project root inside the sandbox.
    pattern: '^/[A-Za-z0-9._/-]+$'   # or `enum:`, or `required: true`

setup:
  install:
    - command: npm ci --prefix '${{ kit.args.dir }}/api'
      user: "1000"
```

Callers supply values with `--kit-arg`, or in `sbxenv.yaml` with the object
form of a kit entry — which is what module 4's environment file is doing when
it tells the clone kit which repo to fetch:

```bash no-run-button
sbx run claude --kit ./kits/sessionboard --kit-arg dir=/srv/app
```

```yaml no-run-button
kits:
  - source: ./kits/sessionboard
    args:
      dir: /srv/app
```

Values are validated *before* the sandbox is created, so a missing `required:`
input or one that fails its `pattern` fails fast instead of halfway through an
install command.

> [!WARNING]
> Never put a secret in a kit argument. Values are plain text — they stay in
> your shell history and sit unencrypted in any args file. Credentials go
> through `credentials:` and the host secret store, which is the whole point
> of that machinery.
