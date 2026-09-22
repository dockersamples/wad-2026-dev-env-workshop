<!--
layout: section
eyebrow: "Module 3"
-->

# Sharing the environment

Every flag is a thing a teammate has to know. Every thing they have to know is
a thing they'll get wrong.

---

<!-- layout: split -->

# So far

<!-- region -->

:::card{label="Module 1" accent=neutral}
The boundary: microVM, private daemon, deny-by-default egress, injected
credentials.
:::

:::card{label="Module 2" accent=neutral}
A kit that carries your project's tools, network rules, startup commands, and
conventions.
:::

<!-- region -->

:tag[The gap]{accent=amber}

Starting it is still a command full of flags — plus a `sbx secret set`, plus a
settings change, plus the bit you forgot.

Which means it's still a doc, and docs go stale.

Note: The "still a doc" line is the hinge into this module. Everything we've
built is good and none of it is shareable yet.

---

<!-- layout: split -->

# From flags to a file

<!-- region -->

:tag[Before]{accent=red}

```console
$ sbx run claude . \
    --kit ./kits/sessionboard \
    --kit docker.io/sbx/github-ssh-kit:latest \
    --publish 3000:3000 \
    --name sessionboard-dev
```

…plus `sbx secret set`, plus the settings change, plus the bit you forgot.

<!-- region -->

:tag[After]{accent=green}

```console
$ sbx env run
```

The Compose-shaped experience, for sandboxes.

Note: The comparison is the pitch. Everything on the left is real setup that
currently lives in a doc.

---

# One file, the whole environment

```yaml filename="sbxenv.yaml"
schemaVersion: "1"
name: sessionboard-dev
agent: claude
workspace: { path: . }

kits:
  - ./kits/sessionboard
  - docker.io/sbx/github-ssh-kit:latest

secrets:
  github: { command: gh auth token }     # resolved on the HOST, never in the file

bindings:
  github: { apiKey: { domains: [api.github.com, github.com] } }

mcp:
  servers: [{ name: context7, url: "https://mcp.context7.com/mcp" }]

ports:
  - { sandbox: 3000, host: 3000, protocol: tcp4 }

sandboxOptions: { cpus: 4, memory: 8g }
```

Note: Walk it top to bottom once. The agent, the workspace, the kits, the
credentials, the MCP servers, the ports, the machine size.

Ports from the start — that's the bit people miss when they've been doing
`sbx ports` by hand.

---

<!-- layout: split -->

# It runs commands on your host, so it asks first

<!-- region -->

```console
$ sbx env plan

  + sandbox     sessionboard-dev (claude)
  + kit         ./kits/sessionboard
  + secret      github ← command: gh auth token
  + binding     github apiKey → api.github.com
  + mcp server  context7
  + port        3000 → 3000/tcp4

Plan: 8 to add, 0 to change, 0 to destroy.
```

<!-- region -->

:::card{label="Read it like a Terraform plan" accent=amber}

Because that's what it is.

Literal secret **values** appear as SHA-256 digests. References, host
commands, ports, and binding domains stay readable — so you can actually
review what you're approving.

:::

Note: `secrets.*.command` and the `lifecycle` block run on *your* host with
*your* privileges. That's a real capability and the plan is the control.

`--auto-approve` exists for CI and approves only that invocation.

---

<!--
layout: quote
theme: dark
-->

> `sbx env run` is not `docker compose up`.

**Changes to kits, ports, workspaces, secrets, and sandboxOptions apply only at creation**

Note: This is the single most common surprise. Against an existing sandbox,
`sbx env run` applies `env:` values and reconciles MCP servers — and nothing
else.

`sbx env rm` then `sbx env run` to apply the rest. Which is a good reason to
keep heavy tooling in a template image and kits thin: you'll recreate often.

---

<!-- layout: split -->

# Where MCP actually runs

<!-- region -->

```yaml
mcp:
  servers:
    - name: context7
      url: https://mcp.context7.com/mcp
```

The gateway lives on the **host** side of the boundary.

<!-- region -->

:::card{label="The consequence" accent=amber}

A **local stdio** MCP server runs as a process on your host, not in the VM.

If it starts a container, it uses **your** Docker daemon.

:::

The VM boundary doesn't cover MCP. Network policy doesn't either — MCP access
is governed separately, at the gateway.

Note: Worth thirty seconds because it's genuinely surprising, and because
someone will otherwise assume a sandboxed agent's MCP servers are sandboxed.

---

<!-- layout: split -->

# The same file, everywhere

<!-- region -->

:tag[Your laptop]{accent=blue}

```console
$ sbx env run
```

:tag[CI]{accent=green}

```console
$ sbx env create --auto-approve
$ sbx env exec -- npm test
$ sbx env rm --force
```

<!-- region -->

:tag[Team defaults + your tweaks]{accent=neutral}

```console
$ sbx env run base.sbxenv.yaml local.sbxenv.yaml
```

Maps merge by key, lists concatenate, later scalars win.

Commit the base. Gitignore the local.

`~/.sbxenv.yaml` sets defaults for every project you have.

Note: CI and your laptop now agree because they read the same file. That's the
reproducibility claim, made concrete.

---

<!--
layout: section
eyebrow: "Hands on — 12 minutes"
-->

# Module 3 in the lab

Write the file · read the plan · run it · hit the recreate gotcha · run the
tests through `sbx env exec`

Note: Four checkpoints. The gotcha is deliberately in the path — they should
feel it rather than be warned about it.
