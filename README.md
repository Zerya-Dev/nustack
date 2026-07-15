# 🐿️ NuStack

[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/graphs/contributors)
[![GitHub issues](https://img.shields.io/github/issues/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/issues)
[![GitHub stars](https://img.shields.io/github/stars/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/stargazers)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/commits/master)

NuStack is an opinionated tooling ecosystem for Nuxt. It focuses on standardizing configurations, reducing boilerplate, and providing stable tools for large Nuxt applications.

Useful links:

- [Playground](https://stackblitz.com/github/Zerya-Dev/nustack/tree/master/modules/lint/playground?file=app%2Fapp.vue)
- [Initial RFC](rfcs/00-nustack-rationale.md)

> [!NOTE]
> NuStack is still **work in progress**. Some parts are plans rather than published packages, but
> other are used daily in real applications. If you're here now, you're probably looking for
> [`@nustackjs/lint`](modules/lint) - zero-config, project-aware ESLint (Oxlint-ready) for the Nuxt ecosystem.

## 🤔 Why does this exist?

In large Nuxt applications, too much time is spent choosing libraries, aligning configurations, and duplicating setups across repositories. NuStack solves this by providing a stable, opinionated ecosystem for Nuxt. We consolidate core framework usage, modules, linting, and testing in one place so you can focus on building your product.

For the full rationale, see [RFC 00: NuStack rationale](rfcs/00-nustack-rationale.md).

---

## ✨ Key Features

- **End-to-end testing**
  - Tests across all of the libraries treated as part of the stack.
- **Opinionated starters**
  - Maintained Nuxt starters based on our selected tooling.
- **Layers and Modules**
  - Common code, setup, and logic moved out of your app code.
- **Ecosystem Contributions**
  - Upstream improvements across the entire ecosystem.

---

## 📦 Packages

### 🧹 Linting

- [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint): Zero-config, project-aware ESLint (Oxlint-ready) for Nuxt.

Standalone ESLint plugins used under the hood:

- [`@nustackjs/lint-plugin-nuxt`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt)
- [`@nustackjs/lint-plugin-vueuse`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse)
- [`@nustackjs/lint-plugin-vite`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite)
- [`@nustackjs/lint-plugin-nuxt-ecosystem`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem)

---

## 🤝 Community

NuStack relies on community feedback. If you find bugs or have ideas for new tools, please open an issue or start a discussion on GitHub.

When contributing with AI, please follow [Nuxt's AI-assisted contribution guidelines](https://nuxt.com/docs/4.x/community/contribution#ai-assisted-contributions). Write issues in your own voice and only submit work you fully understand.

### 🏆 Top Contributors

<a href="https://github.com/Zerya-Dev/nustack/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Zerya-Dev/nustack" alt="Contributors Image">
</a>

---

## 📜 License

NuStack is licensed under the [MIT License](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE).

---

**Developed and used daily by [💫 Zerya](https://zerya.dev)** — want to build amazing things with us?
Feel free to [get in touch](https://zerya.dev).
