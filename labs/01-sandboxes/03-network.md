# The network is deny-by-default

All outbound TCP leaves through a proxy on your host that checks every
connection against a policy. UDP and ICMP are blocked outright and can't be
unblocked.

Ask the agent to do some work. In the **Agent session** tab:

```prompt terminal-id=agent
Add a /healthz endpoint to the SessionBoard API and write a test for it
```

It gets partway and stops: `npm install` can't reach `registry.npmjs.org`.
That's the boundary, working. Confirm it from **Your machine**:

```bash terminal-id=host
sbx policy check network registry.npmjs.org
```

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
