<!--
layout: section
eyebrow: "Module 1"
-->

# Sandboxes and the boundary

What you're actually isolating, and why a container stopped being enough.

---

<!-- layout: split -->

# A container isolates an application. An agent is not an application.

<!-- region -->

:::card{label="Application" accent=neutral}

Runs. Does its job. Touches what it was handed.

You know the set of things it will do before it starts.

:::

<!-- region -->

:::card{label="Agent" accent=amber}

Decides what to do next, then does it.

To your filesystem, your network, your cloud account — with authority you
granted on purpose.

:::

Note: This distinction is the whole reason sandboxes exist as a separate
thing. Containers were designed for the left-hand column.

---

# The authority is the point

An agent that can't install a dependency, reach an API, or hold a credential
can't do the job.

:::fragment

But every capability you add to a container costs you isolation.

:::

:::fragment

Mount the Docker socket so the agent can build images — it can now reach every
container on your machine, including the ones that aren't yours.

:::

:::fragment

**Each grant dissolves a little more of the wall you were counting on.**

:::

Note: Don't skip past this. The instinct in the room will be "just use a
container with fewer permissions" — and the answer is that the permissions
it needs to be useful are exactly the ones that break the isolation.

---

<!-- layout: split -->

# Move the boundary out

<!-- region -->

The agent gets **full control inside** — root, sudo, a package manager, a
Docker daemon.

The walls stay up, because the walls are a hypervisor.

<!-- region -->

:::card{label="Five layers" accent=blue}

- **Hypervisor** — own kernel per sandbox
- **Network** — deny by default, host proxy
- **Docker Engine** — private, per sandbox
- **Workspace** — mountless, clone, or direct
- **Credentials** — injected outside the VM

:::

Note: "Full control inside, enforced walls outside" is the sentence to
remember. The boundary is a property of the machine, not an agreement with
the model.

---

<!-- layout: stats -->

# One command

:::stat{value="1" label="kernel per sandbox"}
Not shared with your host
:::

:::stat{value="0" label="host daemon access"}
Its own Docker engine
:::

:::stat{value="deny" label="default egress"}
Every TCP connection checked
:::

Note: `sbx run claude`. That's it. Demo this live in the lab tab.

---

# Comparison, honestly

| Approach | Isolation | Docker access | Use it for |
| --- | --- | --- | --- |
| **Sandbox (microVM)** | Full — own kernel | Isolated daemon | Autonomous agents |
| Container + socket mount | Partial — namespaces | **Your host daemon** | Trusted tools |
| Docker-in-Docker | Partial — privileged | Nested daemon | CI pipelines |
| Host execution | None | Host daemon | Manual work |

Sandboxes trade resource overhead for complete isolation.

Note: Be fair here. A container is the right answer for a trusted tool, and
a VM costs you memory. The trade is: use a sandbox when you need to give
something autonomous full capability without trusting it with your host.

---

<!--
layout: quote
theme: dark
-->

> All outbound TCP traffic, including HTTP, HTTPS, and SSH, is blocked unless
> an explicit rule allows the destination.

**Docker Sandboxes — default security posture**

Note: UDP and ICMP are blocked at the network layer and cannot be unblocked
with policy at all. DNS goes through the sandbox's own resolver, which
enforces the same policy — so an agent can't exfiltrate over DNS either.

---

<!-- layout: split -->

# The dial is in your hand, while it runs

<!-- region -->

:tag[Terminal 1]{accent=neutral}

The agent is working. `npm install` fails — `registry.npmjs.org` isn't
allowed.

:tag[Terminal 2]{accent=blue}

```console
$ sbx policy allow network registry.npmjs.org
Rule added to policy local
```

<!-- region -->

:::card{label="Then" accent=green}

Same prompt. Different outcome.

**No restart. No recreate.** Policy is evaluated per connection.

:::

:::card{label="And back again" accent=red}

`sbx policy deny network <host>` — deny always beats allow, including over a
rule a kit added.

:::

Note: **This is the demo.** Switch to the lab tab and do it live: run the
prompt, watch it fail, allow the host from the other terminal, run the same
prompt again.

If you do one thing from the stage today, do this one. It turns "there's a
boundary" from a claim into something they watched happen.

---

<!-- layout: split -->

# Credentials the agent never holds

<!-- region -->

A secret in an environment variable is a secret the agent can read, print, and
paste into a bug report.

`sbx` keeps the value on the **host**. The proxy injects it into the outbound
request. The sandbox sees a placeholder.

<!-- region -->

```console
$ sbx secret set github \
    --command 'gh auth token'
Saved secret for service "github"
Source: command (refresh: 55m)
```

:::card{label="Three shapes"}

- A literal value, typed at a prompt
- A **host command** that prints it
- A **reference** — `op://…` or an AWS ARN

:::

Note: The command form is the good one — the token refreshes from your host
on a timer rather than going stale in a keychain.

Changes take effect in running sandboxes immediately, same as policy.

---

# Ports, briefly

```console
$ sbx run --publish 8080:3000 --name sessionboard claude     # at creation

$ sbx ports sessionboard --publish 3000:3000                 # after the fact
Published 127.0.0.1:3000 -> 3000/tcp
```

:::fragment

The catch that costs everyone twenty minutes once: the service must listen on
`0.0.0.0`, not `127.0.0.1`. Most dev servers need `--host 0.0.0.0`.

:::

Note: Sandboxes are isolated in both directions. `host.docker.internal`
reaches back the other way, and needs `sbx policy allow network
localhost:<port>` because the proxy rewrites it.

---

<!--
layout: section
eyebrow: "Hands on — 15 minutes"
-->

# Module 1 in the lab

Start a sandbox · prove the daemon is separate · watch the policy block the
agent · change it while it runs · store a credential · publish a port

Note: Send them to the lab. Six checkpoints. Walk the room.

Come back when most people have the green tick on "publish a port".
