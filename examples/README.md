# Run it for real

Everything the workshop builds, as working files. The lab's terminal is
scripted so nobody needs credentials during the session; this directory is the
same thing on your own machine, with nothing simulated.

## What's here

```
examples/
├── sbxenv.yaml              # the module-4 environment: one command, whole setup
├── kits/
│   ├── sessionboard/        # the project kit — tools, Compose stack, conventions
│   └── github-clone/        # clones the repo inside the sandbox at create time
└── sessionboard/            # the app: Express API + Postgres
    ├── compose.yaml
    ├── api/
    └── db/init.sql
```

## Prerequisites

1. **`sbx` 0.45.0 or later** — [install and setup](https://docs.docker.com/ai/sandboxes/install/),
   then `sbx login`.
2. **A GitHub token on your host**, which `sbxenv.yaml` resolves through the
   `gh` CLI. The value stays on your host; the sandbox only ever sees a
   sentinel.

   ```console
   $ sbx secret set github --command 'gh auth token'
   ```

3. **Credentials for your agent.** Claude Code signs in on the host via OAuth,
   or `sbx secret set anthropic` for an API key.

## Start the full environment

```console
$ cd examples
$ sbx env plan          # read what it changes outside the sandbox
$ sbx env run           # approve, create, attach
```

Then open **http://localhost:8080** for VS Code in the browser, running inside
the microVM with the stack already up. The API answers on
**http://localhost:3000/healthz**.

To tear it down:

```console
$ sbx env rm
```

> [!IMPORTANT]
> `sbx env run` against an **existing** sandbox only applies `env:` values and
> reconciles MCP servers. Changes to kits, ports, workspaces, secrets, or
> `sandboxOptions` need `sbx env rm` followed by `sbx env run`.

## Point it at your own fork

`sbxenv.yaml` is mountless — nothing from your machine is shared, and
`github-clone` brings the repo in from GitHub instead. Change the `repo:` arg
to your fork, and the agent can push to it directly (the proxy injects your
token for `github.com` and `api.github.com`).

To work against your local checkout instead, drop the `github-clone` kit and
add a workspace:

```yaml
workspace:
  path: ./sessionboard
  clone: true      # read-only host mount, agent works in a private clone
```

## Build up to it in pieces

The environment file is the end state. Each part works on its own:

```console
# Just the project kit, no environment file
$ sbx run claude ./sessionboard --kit ./kits/sessionboard

# Add VS Code in the browser
$ sbx run claude ./sessionboard \
    --kit ./kits/sessionboard \
    --kit docker.io/sbx/code-server-kit:latest \
    --publish 8080:8080

# Iterate on a kit against a sandbox that's already running
$ sbx kit validate ./kits/sessionboard
$ sbx kit add <sandbox-name> ./kits/sessionboard
```

## About the kit source allowlist

By default `sbx` only installs kits from `docker.io/`. Everything here is
either a local path (governed by `kit.allowLocalKits`, which defaults to
`true`) or a Docker Hub reference, so none of it needs a settings change.

If you want to pull kits straight from
[`docker/sbx-kits-contrib`](https://github.com/docker/sbx-kits-contrib) over
Git, widen the list deliberately — it **replaces** the whole list, so include
what you want to keep:

```console
$ sbx settings set kit.allowedSources '["docker.io/","github.com/docker/"]'
```

A kit's install commands run as root inside the sandbox. That allowlist is the
reason it can't be any root you happened to type.

## Credits

`kits/github-clone` is adapted from
[cdupuis/sbx-kits](https://github.com/cdupuis/sbx-kits/tree/main/github-clone),
trimmed and vendored so the workshop needs no allowlist change.

## Reference

- [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/) — install, isolation, governance
- [Kits](https://docs.docker.com/ai/sandboxes/customize/kits/) · [spec reference](https://docs.docker.com/ai/sandboxes/customize/kit-reference/)
- [Environment files](https://docs.docker.com/ai/sandboxes/configuration/environment-files/)
- [docker/sandbox-kit-spec](https://github.com/docker/sandbox-kit-spec) — Kit v3
