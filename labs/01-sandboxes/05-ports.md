# Getting a port back out

Sandboxes are network-isolated in both directions, so your browser can't reach
the API the agent just started. 

When starting a sandbox, you can specify ports to publish:

```bash no-run-button
sbx run --publish 8080:8080 claude
```

The ports follow the same order as containers: `<HOST_PORT>:<SANDBOX_PORT>`.

But, what if you decide to publish a port on an existing sandbox?
Fortunately, you can adjust published ports at any point.

To publish a port, use the `sbx ports <sandbox> --publish` command:

```bash terminal-id=host
sbx ports sessionboard --publish 3000:3000
```

To view the ports published by a sandbox, use the `sbx ports <sandbox>` command:

```bash terminal-id=host
sbx ports sessionboard
```

When you no longer need a port published, you can unpublish it as well:

```bash terminal-id=host
sbx ports sessionboard --unpublish 3000:3000
```

> [!TIP]
> One catch worth knowing now: the service has to listen on `0.0.0.0`, not
> `127.0.0.1`, or the forward has nothing to connect to. Most dev servers need a
> `--host 0.0.0.0` flag for this.

---

You have an agent with real capabilities and a boundary you can see and adjust.

**Next:** back to the slides for module 2, then the
**Customizing the sandbox with kits** lab — where the sandbox stops being
generic and starts knowing about your project.
