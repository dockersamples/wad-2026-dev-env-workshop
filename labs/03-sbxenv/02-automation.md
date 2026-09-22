# The same file everywhere

The file isn't only for humans. CI can create without attaching, run
something, and clean up:

```bash terminal-id=host
sbx env exec -- npm test
```

```bash no-run-button
sbx env create --auto-approve
sbx env exec -- npm test
sbx env rm --force
```

Your CI and your laptop now agree, because they read the same file.

## Team defaults, personal tweaks

Files merge in order — maps by key, lists concatenate, later scalars win:

```bash no-run-button
sbx env run base.sbxenv.yaml local.sbxenv.yaml
```

Commit `base.sbxenv.yaml`; gitignore `local.sbxenv.yaml` for your own memory
limit and log level. And `~/.sbxenv.yaml` sets defaults across every project —
`workspace: ${{ env.projectDir }}` plus your preferred agent means `sbx env
run` does something sensible in a repo with no environment file at all.
