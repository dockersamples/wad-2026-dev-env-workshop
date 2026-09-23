<!--
layout: section
eyebrow: "Module 2"
-->

# Customizing the sandbox

A bare sandbox is a boundary, not an environment.

---

<!-- layout: split -->

# So far

<!-- region -->

:::card{label="Module 1 gave us" accent=neutral}

- An agent in a microVM — own kernel, own Docker daemon
- Deny-by-default egress you can change while it runs
- Credentials injected outside the VM
- A port published to the browser

:::

<!-- region -->

:tag[The gap]{accent=amber}

All of that is **generic**.

Nothing about *this project* — its tools, the services it talks to, the way
this team works — is inside the sandbox yet.

Note: One slide of recap so this deck stands on its own. If you're running
straight through, say it in a sentence and move on.

---

# Something still has to say…

:::fragment

…which tools are inside.

:::

:::fragment

…which services it may reach.

:::

:::fragment

…which credentials it may spend.

:::

:::fragment

…what the agent should know about **your** project.

:::

:::fragment

That's a **kit**: a `spec.yaml`, applied when the sandbox is created.

:::

Note: Build the list one press at a time. The last one is the one people
underestimate and the one that pays off most.

---

<!--
layout: split
columns: 1 1
-->

# Two kinds

<!-- region -->

:tag[kind: sandbox]{accent=amber}

Defines a whole agent — image, entrypoint, everything.

- Package a custom agent
- Ship a team-internal default
- Run a fork of an existing one

<!-- region -->

:tag[kind: mixin]{accent=blue}

Extends an existing agent. Stack as many as you like.

- Pre-install tools
- Grant access to a service
- Inject shared team config

Note: Mixins are 95% of what you'll write. Sandbox kits are how every built-in
agent — claude, codex, copilot — is itself defined.

Flag the naming: v3 of the spec renames `sandbox` to `workload`. Come back to
that at the end.

---

# What a kit declares

| Block | Does |
| --- | --- |
| `args` | Inputs the kit takes — `${{ kit.args.x }}` |
| `setup.install` | Commands run **once**, at creation |
| `setup.startup` | Commands run at **every start** — must be idempotent |
| `setup.files` | Files written at startup, runtime values substituted |
| `files/home/`, `files/workspace/` | Static files bundled with the kit |
| `permissions.network` | `allow` / `deny`, scoped to sandboxes using this kit |
| `credentials` | A service, its in-VM variable, where the proxy may spend it |
| `ports` | Ports the kit's services listen on |
| `agentInstructions` | Markdown appended to the agent's memory file |

Note: `install` vs `startup` is the distinction people get wrong.
`docker compose up -d` is a startup command and is safe to run twice.
`docker compose up` is not.

`args` is worth ten seconds: a kit declares inputs, references them as
`${{ kit.args.x }}`, and callers pass `--kit-arg name=value` (or an `args:`
map in sbxenv.yaml). It's what turns a project kit into one several projects
can share. Not for secrets — the values are plain text.

---

<!-- layout: split -->

# Declaring a credential

<!-- region -->

```yaml filename="spec.yaml"
credentials:
  - service: my-service
    apiKey:
      name: MY_SERVICE_API_KEY
      proxyManaged: true
      inject:
        - domain: api.example.com
          header: Authorization
          format: "Bearer %s"

permissions:
  network:
    allow:
      - api.example.com
```

<!-- region -->

:::card{label="Inside the VM" accent=neutral}

`MY_SERVICE_API_KEY=proxy-managed`

:::

:::card{label="On the wire" accent=green}

The proxy overwrites the header with the real value on its way out.

:::

The kit declares the **match and the header**. You supply the **value**, on
the host. The kit never says where your secret lives.

Note: Note that the inject domain has to appear in the network allow list too.
The spec requires it — a credential can only be spent somewhere the kit has
already declared it will talk to.

---

<!--
layout: quote
theme: dark
-->

> A kit's install commands run as root inside the sandbox.

**Which is why you don't load one from just anywhere**

Note: This lands better as a warning than a feature. Then show the allowlist.

---

<!-- layout: split -->

# Kit sources are allowlisted

<!-- region -->

```console
$ sbx run claude --kit \
  "git+https://github.com/docker/sbx-kits-contrib.git#dir=vale"

ERROR: resolve kits: kit cannot be installed
 — its source is not in your allowlist.
```

The default is `docker.io/` and nothing else.

<!-- region -->

```console
$ sbx settings set kit.allowedSources \
    '["docker.io/","github.com/docker/"]'
```

:::card{label="Matching" accent=blue}

Prefixes match on a **path-segment boundary**.

`github.com/docker/` allows
`github.com/docker/sbx-kits-contrib`

…and not `github.com/docker-evil/kit`.

:::

Note: Everyone in the room will hit this the first time they try a Git kit,
so it's worth ninety seconds. The setting replaces the whole list — include
what you want to keep.

Local directories are governed separately by `kit.allowLocalKits`, default
true. That's why the project kit we write works with no configuration.

---

<!-- layout: split -->

# Kits worth stealing today

<!-- region -->

:::card{label="github-ssh" accent=blue}
Pre-seeds GitHub's host keys. SSH never stops to ask.
:::

:::card{label="git-ssh-sign" accent=blue}
Signed commits using the key in your **host's** SSH agent. The private key
never enters the VM.
:::

<!-- region -->

:::card{label="code-server" accent=green}
VS Code in the browser on port 8080, Claude Code extension preinstalled.
:::

:::card{label="playwright, vale, trivy, mise…" accent=neutral}
60+ more in `docker/sbx-kits-contrib`, all published to Docker Hub.
:::

```console
$ sbx run claude \
    --kit docker.io/sbx/github-ssh-kit:latest \
    --kit docker.io/sbx/code-server-kit:latest
```

Note: `sbx kit inspect` on any of these prints its whole ask — network rules,
credentials, ports — before you run it. That's the habit to build.

---

<!-- layout: split -->

# The kit that pays for itself

<!-- region -->

The highest-value kit is the boring one that lives in **your own repo**.

Install what the project needs. Allow what it talks to. Start the stack.

<!-- region -->

```yaml filename="kits/sessionboard/spec.yaml"
setup:
  install:
    - command: npm ci --prefix ./api
      user: "1000"
  startup:
    - command: ["docker","compose","up","-d"]
      background: true

agentInstructions:
  content: |
    Run tests with `npm test --prefix api`.
    Never edit an applied migration;
    add a new one.
```

Note: `agentInstructions` is the sleeper. That content lands in the agent's
memory file for every teammate, so your test command and your migration rule
ship *with the environment* instead of living in one person's head.

---

<!-- layout: split -->

# Iterating without recreating

<!-- region -->

```console
$ sbx kit validate ./kits/sessionboard
VALID: ./kits/sessionboard (directory)

$ sbx kit add sessionboard ./kits/sessionboard
Recreating sandbox to apply kit list...
Kit "sessionboard" added
```

<!-- region -->

:::card{label="Survives the restart" accent=green}
Installed packages · Docker images · volumes · agent history
:::

:::card{label="Only these three blocks" accent=amber}
`environment.variables` · `setup.install` · `permissions.network.allow`
:::

Anything else — credentials, ports, files, startup — needs a full recreate.

Note: Good enough for the write-test-fix loop while you're authoring a kit.

`sbx kit push` publishes to any OCI registry; `sbx kit sign` / `verify` adds
cosign signatures, and `kit.requireSignature` makes them mandatory.

---

<!--
layout: section
eyebrow: "Hands on — 18 minutes"
-->

# Module 2 in the lab

Inspect a published kit · hit the allowlist and widen it · write a project kit
· add it to a running sandbox

Note: Four checkpoints. The kit they write in the lab is the one we'll
reference by path in module 3, so it matters that they finish it.
