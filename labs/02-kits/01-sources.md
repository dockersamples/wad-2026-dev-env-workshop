# Where kits come from

A kit's install commands run as **root inside the sandbox**. So `sbx` restricts
where kits may come from. Try a Git source:

```bash terminal-id=host
sbx run claude --kit "git+https://github.com/docker/sbx-kits-contrib.git#dir=vale"
```

Blocked. The default allowlist is `docker.io/` and nothing else:

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
  --kit docker.io/sbx/github-ssh-kit:latest \
  --kit docker.io/sbx/git-ssh-sign-kit:latest \
  --kit docker.io/sbx/code-server-kit:latest
```

Those two GitHub kits are worth knowing: `github-ssh` pre-seeds GitHub's host
keys so SSH never stops to ask, and `git-ssh-sign` wires commit signing to the
key in your **host's** SSH agent — the private key never enters the VM, the
sandbox just asks it to sign.
