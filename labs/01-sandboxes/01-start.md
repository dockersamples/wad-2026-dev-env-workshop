# Start a sandbox

A container isolates an *application*: something that runs, does its job, and
touches what it was handed. An agent is an *actor*. It decides what to do next
and then does it — to your filesystem, your network, your cloud account.

That authority isn't a bug. An agent that can't install a dependency, reach an
API, or hold a credential can't do the work. But with containers, every
capability you add costs you isolation. Mount the Docker socket so the agent
can build images, and it can now reach every container on your machine.

| Approach | Isolation | Docker access |
| --- | --- | --- |
| **Sandbox (microVM)** | Full — own kernel | Its own daemon |
| Container + socket mount | Partial — namespaces | **Your** host daemon |
| Docker-in-Docker | Partial — privileged | Nested daemon |
| Host execution | None | Host daemon |

A sandbox moves the boundary out: the agent gets full control *inside* a
microVM with its own kernel, its own Docker engine, and its own network — and
the walls stay up.

## Start one

Enough theory. In the **Agent session** tab:

```bash terminal-id=agent
sbx run --name sessionboard claude
```

That built a microVM, mounted your project directory into it, and attached you
to Claude running inside. It took seconds because the template image is
cached after the first pull.
