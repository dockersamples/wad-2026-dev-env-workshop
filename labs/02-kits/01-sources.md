# Where kits come from

Sandbox kits can come from a variety of sources:

- **Container registry** (such as Docker Hub)
- **Git repositories**
- **Local filesystem**

Since kits can make changes to the sandbox and the policies that protect them,
`sbx` restricts the sources you can pull kits from.

For example, try launching a kit from a Git URL:

```bash terminal-id=host
sbx run claude --kit "git+https://github.com/docker/sbx-kits-contrib.git#dir=vale"
```

Blocked. The default allowlist is `docker.io/` (Docker Hub) and nothing else:

```bash terminal-id=host
sbx settings get kit.allowedSources
```

Widen it deliberately. The setting **replaces** the list, so include what you
want to keep:

```bash terminal-id=host
sbx settings set kit.allowedSources '["docker.io/","github.com/docker/"]'
```

Entries match on a path-segment boundary, so `github.com/docker/` allows
`github.com/docker/sbx-kits-contrib` but not `github.com/docker-evil/kit`.

```bash terminal-id=host
sbx run claude --kit "git+https://github.com/docker/sbx-kits-contrib.git#dir=vale"
```

Mixins stack — repeat `--kit` as many times as you need:

```bash no-run-button
sbx run claude \
  --kit sbx/github-ssh-kit:latest \
  --kit sbx/git-ssh-sign-kit:latest \
  --kit sbx/code-server-kit:latest
```

Those two GitHub kits are worth knowing: 

- `github-ssh` pre-seeds GitHub's host keys so SSH never stops to ask
- `git-ssh-sign` wires commit signing to the key in your **host's** SSH agent — 
  the private key never enters the VM, the sandbox just asks it to sign.
