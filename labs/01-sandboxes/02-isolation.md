# Two daemons, one machine

The agent can run `docker build` and `docker compose up` all day. Ask it what
containers are running — from inside the sandbox:

```prompt terminal-id=agent
!docker ps
```

The agent sees no containers running. 

Now run the same command on **Your machine**:

```bash terminal-id=host
docker ps
```

For the simulated environment, you'll see a few example containers. The key is
that there are two different daemons. The agent has a full Docker engine and no 
path at all to yours.

> [!NOTE]
> Docker Sandboxes don't require Docker Desktop. Therefore, you can use sandboxes
> and the embedded Docker engine without even needing an engine on your host.