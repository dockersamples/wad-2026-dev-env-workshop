<!--
layout: title
byline: "Michael Irwin · Docker"
-->

# The AI-Ready Developer Environment

Local setup, reproducibility, and Docker

Note: Welcome. Two hours on the clock, about ninety minutes of material, so
there's room to stop and argue.

Before anything else: the lab you'll work in has a scripted terminal. Every
command is real — same flags, same output — but nothing needs an API key, a
subscription, or a working conference network. You can run all of it on your
own machine afterwards and get the same results.

---

<!-- layout: split -->

# Your dev environment grew a second half

<!-- region -->

:tag[2019]{accent=neutral}

:::card{label="What you set up"}

- A language runtime
- A database
- A README that was slightly wrong

:::

<!-- region -->

:tag[Today]{accent=blue}

:::card{label="What you set up" accent=blue}

- All of that
- An agent harness
- Agent-specific tooling
- MCP servers
- Credentials for six services
- Network access for all of it

:::

Note: The first list was already hard to keep consistent across a team. The
second one changes every few weeks and half of it is security-relevant.

Ask the room: who has an onboarding doc that's currently wrong? Hands stay up.

---

<!--
layout: section
eyebrow: "The question"
-->

# How do you give developers and agents what they need, and keep the environment consistent, reproducible, and safe?

Three modules, then a pattern to take home.

Note: Consistent — everyone gets the same thing. Reproducible — you can
recreate it from a file. Safe — the thing you handed capabilities to can't
turn around and use them on you.

Those pull against each other. That tension is the talk.
