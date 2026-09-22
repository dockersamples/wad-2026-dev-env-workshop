# Getting a port back out

Sandboxes are network-isolated in both directions, so your browser can't reach
the API the agent just started. Publish it:

```bash terminal-id=host
sbx ports sessionboard --publish 3000:3000
```

```bash terminal-id=host
sbx ports sessionboard
```

```bash terminal-id=host
sbx ls
```

One catch worth knowing now: the service has to listen on `0.0.0.0`, not
`127.0.0.1`, or the forward has nothing to connect to. Most dev servers need a
`--host 0.0.0.0` flag for this.

---

You have an agent with real capabilities and a boundary you can see and adjust.

**Next:** back to the slides for module 2, then the
**Customizing the sandbox with kits** lab — where the sandbox stops being
generic and starts knowing about your project.
