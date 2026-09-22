# The AI-Ready Developer Environment

Workshop for **WeAreDevelopers 2026** — local setup, reproducibility, and
Docker Sandboxes.

Modern AI development adds a layer to the development environment: agent
harnesses, agent-specific tooling, MCP servers, external services,
credentials. This workshop builds an environment that handles all of it and
that a teammate can start with one command.

## What's in here

Four modules, each a **deck followed by a lab**. Eight cards on the landing
page in presentation order, so nobody flips back and forth mid-deck or
mid-lab.

| Order | Entry | What it covers |
| --- | --- | --- |
| 1 | [`01-sandboxes-slides`](labs/01-sandboxes-slides/) · 14 slides | Why a container stopped being enough for an agent; the five isolation layers |
| 2 | [`01-sandboxes`](labs/01-sandboxes/) · 6 pages, 6 checkpoints | Start an agent, prove the daemon is separate, change a network policy while it runs, store a credential, publish a port |
| 3 | [`02-kits-slides`](labs/02-kits-slides/) · 12 slides | What a kit declares, mixin vs sandbox, the source allowlist, credential injection |
| 4 | [`02-kits`](labs/02-kits/) · 4 pages, 4 checkpoints | Inspect a published kit, hit the allowlist, write a project kit, `sbx kit add` |
| 5 | [`03-sbxenv-slides`](labs/03-sbxenv-slides/) · 9 slides | One file for the whole environment; the plan you approve; where MCP actually runs |
| 6 | [`03-sbxenv`](labs/03-sbxenv/) · 4 pages, 4 checkpoints | Write it, plan it, run it, hit the recreate rule |
| 7 | [`04-patterns-slides`](labs/04-patterns-slides/) · 14 slides | Workspace modes and their real cost, the devcontainers pattern, Kit v3 |
| 8 | [`04-patterns`](labs/04-patterns/) · 3 pages, 2 checkpoints | Bring up the full stack and reach it through the published port |

[`examples/`](examples/) has the same environment as working files, to run for
real: both kits, the `sbxenv.yaml`, and the SessionBoard app.

Every lab page is one topic with its own checkpoint, so the section nav
doubles as a progress bar and nobody is scrolling through a wall.

Each pair stands alone. Decks 2–4 open with a one-slide recap; labs 2–4 open
with a note saying what state they're picking up from, and each lab's file
seeds and simulator state start where the previous module ended. So a late
arrival can join at module 3 and it still makes sense.

Budget: roughly 45 minutes of slides and 45 of hands-on, leaving the rest of
the two hours for questions and people wandering off-script.

Written against **`sbx` 0.45.0**. Kits and `sbx env` are both experimental, so
re-check the CLI surface before re-running this deck later.

## Author locally

You only need Docker.

```bash
docker compose up dev              # live preview at http://localhost:5173
docker compose run --rm validate   # validate both entries (fails on errors)
```

Edit files under `labs/<id>/` and refresh the browser. In the deck, `s` opens
the presenter window and `p` enters present mode.

The `labs.json` catalog is **generated** from each entry's `labspace.yaml`, so
you never write it by hand.

## Presenting

- Open the deck and the lab in **two browser tabs** and switch between them.
- Two labs have **presenter toggles** in their Settings dialog, flipping the
  same state the real commands write — handy for demoing without typing.
  Module 1 has "Allow registry.npmjs.org"; module 2 has "Widen the kit source
  allowlist".
- Module 4's code-server payoff is a **live demo on your own machine**; the
  lab section walks the same commands and reads along.
- Presence and the instructor dashboard are enabled per entry, so each lab has
  its own funnel: `#/labs/01-sandboxes/insights`, `#/labs/02-kits/insights`,
  and so on (token `dev-token` locally, or whatever `STATS_TOKEN` is set to in
  production).

### Still to do before the session

- Drop a logo into each deck's `assets/` and point `brand.logo` at it in that
  deck's `labspace.yaml`. Brand paths are entry-relative, so all four decks
  need their own copy. The dark slides then each need a per-slide `logo:` with
  the reversed (white) mark, or the dark one vanishes against the background:

  ```bash
  grep -rn "theme: dark" labs/*-slides/*.md
  ```
- Add a code-server screenshot to `labs/04-patterns/00-patterns.md` where the
  live demo lands.
- Walk the deck once in the preview — layouts are visual and validation can't
  see an overcrowded slide.

## Deploy

Push to `main`. [`deploy.yml`](.github/workflows/deploy.yml) validates,
generates the catalog, and publishes to GitHub Pages; pull requests are
validated by [`validate.yml`](.github/workflows/validate.yml) first.

## Authoring with an AI agent

[`.sbxenv.yaml`](.sbxenv.yaml) describes a Docker Sandbox for working on this
repo — Claude Code with the Simspace authoring skills installed, Docker
inside, and ports 5173 and 8888 published:

```bash
sbx env run
```

Which is, appropriately enough, the thing the workshop is about.

## Learn more

- [`AGENTS.md`](AGENTS.md) — how this repo works
- [Simspace specs](https://github.com/dockersamples/simspace/tree/main/spec) — the content format
- [Docker Sandboxes docs](https://docs.docker.com/ai/sandboxes/) — the subject matter
