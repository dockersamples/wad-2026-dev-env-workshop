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
  - container: 3000
    protocol: tcp
    name: api

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
