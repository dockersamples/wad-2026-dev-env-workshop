# Read the plan, then run it

`secrets.*.command` and the `lifecycle` block run on **your host**, with your
privileges. So `sbx env` shows you a plan and asks:

```bash terminal-id=host
sbx env plan
```

Everything that happens outside the sandbox is in that list: host commands,
credentials, binding domains, MCP registrations, ports, kits. Literal secret
values show as SHA-256 digests; references and commands stay readable so you
can actually review them. Read it like a Terraform plan, because that's what
it is.

```bash terminal-id=host
sbx env run
```

One command. Agent, kits, stack, credentials, port — and you're attached.

## A word on MCP

The `mcp:` block registers servers for the sandbox's agent. Worth knowing
where they actually run: the MCP gateway lives on the **host** side of the
boundary. A remote server is reached from your host; a local stdio server runs
as a process on your host, *not* inside the VM. So if that stdio server starts
a container, it uses **your** Docker daemon.

The VM boundary doesn't cover MCP. Network policy doesn't either — MCP policy
is enforced separately, on the gateway.
