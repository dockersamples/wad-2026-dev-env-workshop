<!--
layout: section
eyebrow: "Module 4"
-->

# Patterns and what's next

The choices you'll actually argue about on a team.

---

<!-- layout: split -->

# So far

<!-- region -->

:::stat{value="1" label="boundary"}
microVM, private daemon, deny-by-default
:::

:::stat{value="2" label="kits"}
project tools and conventions
:::

:::stat{value="3" label="one file"}
`sbx env run`
:::

<!-- region -->

:tag[Two questions left]{accent=amber}

**How does the code get in?** Mounted, cloned, or fetched — and each choice is
a different security boundary.

**Where do you actually edit it?** If nothing is installed locally, what are
you typing into?

Note: These two questions are what module 4 answers, and they're the ones
people ask first when they try this on a real project.

---

# How the project gets in

| Mode | Boundary | Costs you |
| --- | --- | --- |
| **Direct mount** _(default)_ | None — agent writes your working tree | Hooks, CI config, IDE tasks all writable |
| **Clone mode** (`--clone`) | Repo mounted **read-only**, agent works in a private clone | Work is stranded until you fetch or push |
| **Mountless** | Nothing shared; the kit clones inside | Needs a clone kit and a token |

:::fragment

Clone mode protects your repo from **modification**, not from **inspection** —
the read-only mount includes untracked and gitignored files. Including
`.env`.

:::

Note: Correct a myth if it comes up: direct mounts aren't meaningfully slow.
Host-side caching is on by default. What *is* slow is mounting network or
cloud-synced storage — an SMB share makes every read a round trip.

The real argument for clone mode is the boundary, not performance.

---

<!--
layout: quote
theme: dark
-->

> Treat a direct-mount session like a pull request from an untrusted
> contributor.

**And remember `git diff` won't show you `.git/hooks/`**

Note: Git hooks run on commit and push. CI config runs on push. `package.json`
scripts run on install. `.vscode/tasks.json` runs when you open the project.
`.claude/settings.json` can define hooks that run automatically.

All of those are writable in a direct mount, and none of them are in the diff
people actually read.

---

<!-- layout: split -->

# Devcontainers, taken seriously

<!-- region -->

:::card{label="1 · github-clone" accent=blue}
Clones the repo **inside** at create time, proxy-managed `GH_TOKEN`.
:::

:::card{label="2 · your project kit" accent=blue}
Tooling, then `docker compose up -d`.
:::

:::card{label="3 · code-server" accent=blue}
VS Code on :8080, Claude Code extension in the sidebar.
:::

<!-- region -->

:::card{label="4 · github-ssh + git-ssh-sign" accent=blue}
Push and signed commits work. The signing key stays in your host's agent.
:::

:::card{label="5 · ports" accent=blue}
3000 and 8080 published from the start.
:::

```console
$ sbx env run
$ open http://localhost:8080
```

Note: **Live demo here.** This is the one you run for real on your own
machine — the lab reads along with a screenshot.

Show the editor, the running stack, and Claude Code in the sidebar. Then say
the punchline on the next slide.

---

<!--
layout: stats
theme: dark
-->

# What's installed on your laptop

:::stat{value="0" label="language runtimes"}
Node, Postgres, none of it
:::

:::stat{value="1" label="browser tab"}
The whole editor
:::

:::stat{value="sbx env run" label="onboarding"}
That's the doc
:::

Note: The agent you drive from that browser tab is running *inside* the
sandbox. It gets the full boundary — own kernel, own daemon, deny-by-default
egress, credentials it can't read — and you get an editor.

---

# One tuning note before we finish

:::card{label="Templates vs kits" accent=amber}

A **template** is an image, built ahead of time. A **kit** is YAML, applied at
creation.

Kits re-run their install commands on every recreate — and you'll recreate
often.

:::

:::fragment

**Thick template, thin kits.** Put the slow, stable tooling in an image; keep
the per-project, per-team, per-credential parts in kits.

:::

Note: This is the practical performance answer for anyone whose `sbx env rm &&
sbx env run` cycle starts feeling slow.

---

<!--
layout: section
eyebrow: "What's next"
theme: light
-->

# Kit v3

Public, moving, and explicitly asking for argument. Final version targeted
Q4 2026.

---

<!-- layout: split -->

# A kit becomes a plain OCI image

<!-- region -->

No new media type. No artifact type. No sidecar file.

The declarations ride in a manifest **annotation** on the image itself.

<!-- region -->

:::card{label="So" accent=green}

`docker pull` works.

`regctl inspect` works.

Every registry, scanner, signer, and mirror you already run handles one
correctly.

:::

`kind: sandbox` becomes `workload`. Mixins stay mixins.

Note: The design tenet is "ride the ecosystem, don't extend it." The cost of a
new artifact format isn't writing it — it's the decade of tooling that doesn't
know about it.

---

<!--
layout: quote
theme: dark
-->

> Dockerfiles made software reproducible.
> Kits make authority reproducible.

**docker/sandbox-kit-spec**

Note: Let this one sit.

A Dockerfile specifies the inside of the image completely and the outside not
at all. The other half — which credentials, which network destinations, which
tools and instructions — has lived in `docker run` flags, a CI config, an
onboarding doc, and whatever the person who set it up still remembers.

---

# Which makes authority diffable

When the next version of an agent asks for another credential, or another
network destination —

:::fragment

that isn't a software update. It's a **change in authority**.

:::

:::fragment

It shows up in the diff. It can stop for approval. And it travels with the
thing it describes, wherever that thing runs.

:::

Note: That last clause is why it's a specification and not a product feature.
A kit that stops being useful because you ran it somewhere else isn't a trust
boundary, it's lock-in.

---

<!-- layout: split -->

# Take it with you

<!-- region -->

Everything from today is in `examples/` in the workshop repo — both kits, the
`sbxenv.yaml`, and the app.

Clone it, `sbx env run`, and you have the final state on your own machine.

<!-- region -->

:::card{label="Docs"}
docs.docker.com/ai/sandboxes
:::

:::card{label="Kits to steal"}
github.com/docker/sbx-kits-contrib
:::

:::card{label="Argue with the spec"}
github.com/docker/sandbox-kit-spec
:::

---

<!--
layout: section
eyebrow: "Hands on — 10 minutes"
-->

# Module 4 in the lab

Update `sbxenv.yaml` to the full stack · bring it up · reach the app through
the published port

Note: Last one, and the shortest. Send them off, then take questions while
they work — there's plenty of clock left.

Anyone who wants to run it for real on their own machine: `examples/` in the
repo is this exact environment, and I'll help you get `sbx` installed.

---

<!--
layout: title
byline: "Thanks · questions?"
-->

# Go break something in a microVM

You can afford to now.

Note: Leave this up for Q&A. Plenty of time left on the clock — take
questions, and offer to help anyone get `sbx` running on their own machine.
