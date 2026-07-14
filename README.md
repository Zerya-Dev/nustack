# 🐿️ NuStack

Opinionated tooling shaped by real projects for the entire Nuxt ecosystem.

> [!NOTE]
> NuStack is still **work in progress**. Some parts are plans rather than published packages, but\
> other are used daily in real applications. If you're here now, you're probably looking for
> [`@nustackjs/lint`](modules/lint) - zero-config, project-aware ESLint (Oxlint-ready) for the Nuxt ecosystem.

## Why does this exist?

In a large Nuxt application, a surprising amount of time is not spent on writing code:
choosing libraries, keeping their configurations compatible, and repeating the same setup in every
repository. We have run into these problems in production projects and want to maintain the solutions
in one place.

NuStack's goal is a stable, opinionated ecosystem for Nuxt. That means looking at the
whole picture: core framework usage, popular modules, linting, testing, starters,
layers, and upstream contributions.

We **aim to provide you** starters, tools, conventions, and modules, so
you can focus on building your product (*and we start today with [linting](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint)*).

For the longer rationale, see [RFC 00: NuStack rationale](rfcs/00-nustack-rationale.md).

## Goals

Our long-term goals for NuStack (for shipped pieces, see [Packages](#-packages)):

- **Tests**: end-to-end tests across all of the libraries treated as part of the stack.
- **Opinionated starters**: maintained Nuxt starters based on our selected tooling.
- **Layers** and **Modules**: move common code, setup and logic out of your app code.
- **Ecosystem Contributions**: upstream improvements across the entire ecosystem.

## Principles

Things we want NuStack conventions to promote in end applications.

- **Best practices over endless choice**: we choose the right tools for the job and standardize on them to avoid unnecessary fragmentation.
- **Stable, not outdated**: we prefer stable, well-tested tools, but don't stay on legacy tooling when a clearly better option becomes available.
- **Everything should be testable**: conventions and implementations must be enforceable through automated tests, so they are actually enforced.
- **Community first**: decisions are made openly through RFCs and community feedback, with upstream contributions whenever possible.

For more information read the [initial RFC](rfcs/00-nustack-rationale.md).

## Packages

- [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) — zero-config, project-aware ESLint (Oxlint-ready)
  for Nuxt. Built on top of standalone ESLint/Oxlint plugins:
  [nuxt](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt),
  [vueuse](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse),
  [vite](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite),
  [nuxt-ecosystem](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem).
  [Try it in the online playground](https://stackblitz.com/github/Zerya-Dev/nustack/tree/master/modules/lint/playground?file=app%2Fapp.vue).

## Community

NuStack is a **community effort**. If you have any feedback about NuStack or Nuxt ecosystem
in general (what breaks, what is the way that you are solving problems, what tooling is missing)
please **ppen an issue, start a discussion, or contribute directly.**

### AI-assisted development and contributions

AI tools have been used during the development of NuStack. They may also be used when contributing,
but the contributor remains responsible for every change and every word they submit. Please follow
[Nuxt's AI-assisted contribution guidelines](https://nuxt.com/docs/4.x/community/contribution#ai-assisted-contributions):

- **Never let an LLM speak for you**: Write issues, comments and pull request descriptions in your own voice.
- **Never let an LLM think for you**: Only submit work that you understand, have checked and can explain.

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors

---

**Developed and used daily by [💫 Zerya](https://zerya.dev)** — want to build amazing things with us?
Feel free to [get in touch](https://zerya.dev).
