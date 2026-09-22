# What's next for kits

Everything you wrote today is `schemaVersion: "2"`. The
[Kit v3 specification](https://github.com/docker/sandbox-kit-spec) is public
and moving, with a final version targeted for Q4 2026.

The shape changes: a kit becomes a **plain OCI image** whose manifest carries
the declarations in an annotation. No new media type, no artifact type, no
sidecar file — so `docker pull` works, `regctl inspect` works, and every
registry, scanner, signer, and mirror you already run handles one correctly.
`kind: sandbox` becomes `workload`; mixins stay mixins.

The argument behind it is worth carrying home:

> A Dockerfile specifies the inside of the image completely and the outside
> not at all. The other half — which credentials, which network destinations,
> which tools and instructions — has lived in `docker run` flags, a CI config,
> an onboarding doc, and whatever the person who set it up still remembers.
>
> **Dockerfiles made software reproducible. Kits make authority reproducible.**

Once authority lives in the artifact, it becomes diffable. When the next
version of an agent asks for another credential or another network
destination, that isn't a software update — it's a change in authority. It
shows up in the diff. It can stop for approval. And it travels with the thing
it describes.

The spec is explicitly asking for argument. If a kit you want to write can't
be expressed, [open an issue](https://github.com/docker/sandbox-kit-spec/issues).

## Take it with you

Everything here is real and committed in `examples/` in this repo — both kits,
the `sbxenv.yaml`, and the SessionBoard app. Clone it, run `sbx env run`, and
you have today's final state on your own machine.

| Where to go | What's there |
| --- | --- |
| [Docker Sandboxes docs](https://docs.docker.com/ai/sandboxes/) | Install, isolation model, governance |
| [Kits](https://docs.docker.com/ai/sandboxes/customize/kits/) · [spec reference](https://docs.docker.com/ai/sandboxes/customize/kit-reference/) | Every `spec.yaml` field |
| [Environment files](https://docs.docker.com/ai/sandboxes/configuration/environment-files/) | Every `sbxenv.yaml` field |
| [docker/sbx-kits-contrib](https://github.com/docker/sbx-kits-contrib) | 60+ community kits to read and steal from |
| [docker/sandbox-kit-spec](https://github.com/docker/sandbox-kit-spec) | Kit v3, and where to argue with it |

Thanks for coming. Go break something in a microVM.
