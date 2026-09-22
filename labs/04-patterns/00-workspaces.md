# How the project gets in

> [!NOTE]
> **Picking up from module 3.** Your :filelink[sbxenv.yaml]{path="sbxenv.yaml"}
> works and the environment has been torn down with `sbx env rm`, so the
> changes below take effect on the next create.

You have the pieces. This last module is about the choices you'll actually
argue about on a team, and the pattern that falls out of them.

## How the project gets into the sandbox

Three options, and the difference is a security boundary, not a convenience.

**Direct mount** (the default — `sbx run claude`, or `workspace: .`). Your
working tree is shared read-write. The agent's edits land on your host
instantly, which is exactly what you want when you're reading diffs as they
appear. It also means there is **no boundary at all** between the agent and
your working tree: `.git/hooks/`, `.github/workflows/`, `package.json`
scripts, `.vscode/tasks.json`, `.claude/settings.json` — all writable, and all
of them execute code when you commit, push, build, or open the project.

Treat a direct-mount session like a PR from a stranger. `git diff` won't show
you `.git/hooks/`; check it yourself.

**Clone mode** (`--clone`, or `workspace: {path: ., clone: true}`). Your repo
is mounted **read-only** at `/run/sandbox/source` and the agent works in a
private clone inside the VM. It cannot touch your working tree or your `.git`,
so hooks and CI config are safe, and two agents on one repo can't race on the
index.

The cost is that work is stranded until you move it: `git fetch
sandbox-<name>` on your host, or let the agent push to a branch. Remove the
sandbox with unpushed commits and they're gone.

And the thing people get wrong: **clone mode protects your repo from
modification, not from inspection.** The read-only mount covers everything
under the Git root — untracked files, gitignored files, your `.env`. Keep
secrets out of the working directory, or use credential injection instead.

**Mountless** (no path at all). Nothing of yours is shared; the kit clones the
repo inside. Strongest boundary, and the basis for the pattern below.

> [!NOTE]
> Workspaces are shared through a filesystem passthrough with host-side
> caching on by default, so a directly mounted repo is usually fine. What you
> should avoid is mounting network or cloud-synced storage — an SMB share or a
> synced folder makes every read a round trip.
