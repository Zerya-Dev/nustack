# 🐿️ NuStack

Opinionated tooling shaped by real projects for the entire Nuxt ecosystem.

> [!NOTE]
> The full stack is **heavily Work in Progress** - the vision is big and still taking shape.\
> But some pieces are already solid and used daily. If you're here now, you're probably looking for
> [`@nustackjs/lint`](modules/lint) - zero-config, project-aware ESLint (Oxlint-ready) for the Nuxt ecosystem.

## ❓ Why?

Ever had a random minor dependency update break your Nuxt website?

That happens because nobody treats the ecosystem as a whole.

[Nuxt](https://nuxt.com) is one of the biggest JS frameworks in the world. If you're
here, you're probably already using it — and you love it. Nuxt has a lot of advantages
and a great ecosystem, but it is still fairly young. New features land often, which means
the ecosystem is not always stable: dependency updates break things, starters and
resources use outdated methods, and there are not enough good examples of how to build
proper apps with modern best practices.

NuStack's goal is a stable, opinionated ecosystem for Nuxt: looking at the whole
picture — core library, popular modules, and tooling — to improve the web development
experience. To make that possible we use **opinionated** software (for example, we love
the [VoidZero](https://void.dev/lander) ecosystem).

We aim to cover most Nuxt use cases over time. For now the primary focus is Nuxt web apps
with an external API, but most of the work generalizes across the other use cases too.

## 🎯 Goals

Our long-term goals for NuStack (for shipped pieces, see [Packages](#-packages)):

- **Tests**: end-to-end tests across all of the libraries treated as part of the stack.
- **Opinionated starters**: real, maintained Nuxt starters, based on the best tooling,
  so you don't have to pick between bad options.
- **Layers** and **Modules**: offload as much work and configuration as possible from you,
  the developer.
- **Ecosystem Contributions**: upstream improvements across the entire ecosystem.

**The goal is to make the Nuxt experience significantly better — not just for simple websites,
but for real-world projects that we and other Nuxters want to build.**

## 🧭 Principles

- **Full type safety.**
- **Comprehensive testability**: everything is covered by automated tests.
  Frontend testing should be straightforward, so every convention and
  standard must be enforceable by automated tests.
- **Best practices over endless choice**: we intentionally avoid supporting
  multiple interchangeable libraries. Instead, we select the best tools for each job
  and standardize on them to reduce fragmentation.

## 📦 Packages

- [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) — zero-config, project-aware ESLint (Oxlint-ready)
  for Nuxt. Built on top of standalone ESLint/Oxlint plugins:
  [nuxt](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt),
  [vueuse](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse),
  [vite](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite),
  [nuxt-ecosystem](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem).

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors

---

**Developed and used daily by [💫 Zerya](https://zerya.dev)** — want to build amazing things with us?
Feel free to [get in touch](https://zerya.dev).
