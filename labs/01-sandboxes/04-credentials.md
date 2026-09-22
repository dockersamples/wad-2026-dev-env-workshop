# Credentials the agent never holds

A secret in an environment variable is a secret the agent can read, print, and
paste into a bug report. `sbx` keeps them on your host instead: the proxy
injects the real value into outbound requests, and the sandbox only ever sees
a placeholder.

```bash terminal-id=host
sbx secret ls
```

Store one. Rather than pasting a token, point `sbx` at a command that produces
it — the token is then refreshed from your host on a timer instead of going
stale in a keychain:

```bash terminal-id=host
sbx secret set github --command 'gh auth token'
```

```bash terminal-id=host
sbx secret ls
```

Three shapes, all stored in your OS keychain:

| Form | Use it for |
| --- | --- |
| `sbx secret set github` | A literal value, typed at the prompt |
| `sbx secret set github --command 'gh auth token'` | A host tool that prints the token |
| `sbx secret set anthropic --ref 'op://Work/Anthropic/credential'` | 1Password or AWS Secrets Manager |

Adding or changing a secret takes effect in existing sandboxes immediately —
no restart, just like policy.

> [!NOTE]
> Pulling images or kits from a **private registry** needs a different flag —
> `sbx secret set --registry ghcr.io --password-stdin`. See
> [Registry credentials](https://docs.docker.com/ai/sandboxes/configuration/credentials/#registry-credentials).
