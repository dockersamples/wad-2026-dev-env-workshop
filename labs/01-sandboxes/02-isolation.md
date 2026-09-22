# Two daemons, one machine

The agent can run `docker build` and `docker compose up` all day. Ask it what
containers are running — from inside the sandbox:

```bash terminal-id=agent
docker ps
```

Nothing. Now run the same command on **Your machine**:

```bash terminal-id=host
docker ps
```

Two different daemons. The agent has a full Docker engine and no path at all
to yours. Nothing the agent starts shows up in your `docker ps`, and removing
the sandbox removes all of it.
