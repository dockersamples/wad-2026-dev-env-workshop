# Iterate, then share it

Normally `--kit` only applies at creation. For a kit that's just install
commands, env vars, and network allows, you can add it to a live sandbox — it
restarts, but packages, images, volumes, and agent history survive:

```bash terminal-id=host
sbx kit add sessionboard ./kits/sessionboard
```

```bash terminal-id=host
sbx exec sessionboard -- docker compose ps
```

Anything beyond those three blocks — credentials, ports, files, startup
commands — still needs a recreate.

## Share it

`sbx kit push` publishes to any OCI registry, so the whole team gets it by
reference:

```bash terminal-id=host
sbx kit push ./kits/sessionboard docker.io/wearedevs/sessionboard-kit:1.0
```

You can also skip publishing entirely and point at the path in your repo,
which is what we'll do next.

> [!TIP]
> `sbx kit sign` and `sbx kit verify` add cosign signatures, and
> `sbx settings set kit.requireSignature true` makes them mandatory. Worth it
> once kits are doing real work in your organisation.

---

The sandbox now knows about your project. What it doesn't have is a way for
anyone else to get the same one.

**Next:** slides for module 3, then the **Sharing the environment with sbxenv**
lab.
