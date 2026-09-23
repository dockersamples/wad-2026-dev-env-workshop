# The network boundary

Every request that leaves your sandbox goes through a network proxy and
policies are used to determine if the request should be allowed to proceed.

There are three different default network policies you can choose for your
sandboxes:

- **Allow all (allow-all)** - all endpoints are available (not secure)
- **Deny all (deny-all)** - all endpoints are denied (very locked down)
- **Balanced (balanced)** - all endpoints are denied, except for a selection of 
  developer-oriented endpoints

Set the default policy by using the `sbx policy init` command. Run the following
command to deny all endpoints:

```bash terminal-id=host
sbx policy init deny-all
```

Ask the agent to do some work. In the **Agent session** tab:

```prompt terminal-id=agent
Add a /healthz endpoint to the SessionBoard API and write a test for it
```

It gets partway and stops: `npm install` can't reach `registry.npmjs.org`.
That's the boundary, working. Confirm it from **Your machine**:

```bash terminal-id=host
sbx policy check network registry.npmjs.org
```

> [!TIP]
> Not all agents will understand they are being blocked by the sandbox. Having
> a mention in your AGENTS.md to guide them is often helpful.
>
> _You are running in a sandbox. If you run into network blocks, stop and ask
> for access, rather than trying to work around it._

## Change the boundary while the agent runs

Here's the part worth remembering. Allow the host — on **Your machine**,
without touching the sandbox:

```bash terminal-id=host
sbx policy allow network registry.npmjs.org
```

Now go back to the **Agent session** tab and ask again:

```prompt terminal-id=agent
Add a /healthz endpoint to the SessionBoard API and write a test for it
```

Same prompt, different outcome. No restart, no recreate — policy changes take
effect on the next connection. The agent's *capability* is a dial you hold,
and you can turn it while it's working.

:filelink[api/server.js]{path="api/server.js"} now has the route, and
:filelink[api/server.test.js]{path="api/server.test.js"} has the test.

> [!TIP]
> `sbx policy log` shows every outbound request the proxy saw and which rule
> matched it — the first place to look when an agent mysteriously can't do
> something.

```bash terminal-id=host
sbx policy log
```

Deny rules always beat allow rules, so `sbx policy deny network <host>` is how
you carve an exception out of a broad allow — including one a kit added.
