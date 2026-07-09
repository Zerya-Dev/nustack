# 🐿️ NuStack

Opinionated tooling shaped by real projects for the entire Nuxt ecosystem.

> [!NOTE]
> The full stack is **heavily Work in Progress** - the vision is big and still taking shape.\
> But some pieces are already solid and used daily. If you're here now, you're probably looking for
> [`@nustackjs/lint`](modules/lint) - zero-config, project-aware ESLint (Oxlint-ready) for the Nuxt ecosystem.

## ❓ Why?

Nuxt is a great framework, but building big, production apps with it still involves **too much
ecosystem work**: choosing tools, fixing incompatibilities, switching between 5 different libraries
that should do the same thing, and fixing random issues that should not be part of building a product.

NuStack's goal is a stable, opinionated ecosystem for Nuxt. That means looking at the
whole picture: core framework usage, popular modules, linting, testing, starters,
layers, and upstream contributions.

We **aim to provide you** starters, tools, conventions, and modules, so
you can focus on building your product (*and we start today with [linting](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint)*).

For the longer rationale, see [RFC 00: NuStack rationale](rfcs/00-nustack-rationale.md).

## 🎯 Goals

Our long-term goals for NuStack (for shipped pieces, see [Packages](#-packages)):

- **Tests**: end-to-end tests across all of the libraries treated as part of the stack.
- **Opinionated starters**: maintained Nuxt starters based on our selected tooling.
- **Layers** and **Modules**: move common code, setup and logic out of your app code.
- **Ecosystem Contributions**: upstream improvements across the entire ecosystem.

**The goal is to make the Nuxt experience significantly better - not just for simple websites,
but for real-world projects that we and other Nuxters want to build.**

## 🧭 Principles

Things we want NuStack conventions to promote in end applications.

- **Best practices over endless choice**: we select the best tools for the job and standardize on them to reduce fragmentation.
- **Stability, but not legacy**: we prefer stable, well-tested tools, but don't stay on legacy tooling when clearly better alternatives exist.
- **Comprehensive testability**: all conventions/implementations need to be enforceable by automated tests.
- **Community first**: built with the community (RFCs etc.), contributing upstream improvements.

## 📦 Packages

- [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) — zero-config, project-aware ESLint (Oxlint-ready)
  for Nuxt. Built on top of standalone ESLint/Oxlint plugins:
  [nuxt](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt),
  [vueuse](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse),
  [vite](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite),
  [nuxt-ecosystem](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem).

## 🤝 Community

NuStack is meant to be **a community effort**. We want feedback from people building real
Nuxt apps: what breaks, what is the way that you are solving problems, what tooling is missing, and what should
be pushed upstream. **Open an issue, start a discussion, or contribute directly.**

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors

---

**Developed and used daily by [💫 Zerya](https://zerya.dev)** — want to build amazing things with us?
Feel free to [get in touch](https://zerya.dev).
