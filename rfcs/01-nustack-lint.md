# RFC 01: NuStack Lint

Status: Draft
*The module is in progress, because we are waiting for Oxlint plugin support.*

## Reasoning

Almost every project has some kind of code policy: rules that are enforced only
during code review. For Nuxt this problem grows. New Nuxt modules, and Nuxt
itself, often have best practices that are only described in the documentation.
As the ecosystem evolves those practices change, and you frequently end up with
multiple ways to achieve the same thing. Some ways are slightly better, some
people simply prefer one over another. Whatever the choice is, it should be
enforced, and enforcing it has real benefits: faster reviews, more consistency,
easier onboarding, and less to keep in your head.

The problem grows even more with the introduction of AI agents. Vue and Nuxt are
fairly new, so agents often don't know how to write them well. A very common
example is auto imports: LLMs oftern import things manually that should be
auto-imported, or reach for three different ways of defining props with defaults
in Vue.

We aim to standardize the Nuxt ecosystem, and linting is a big part of that. We
want to provide a module, as well as a set of linting packages for Nuxt and the
Nuxt ecosystem, that catch the rules which today only live in the docs.

## Solution

To achieve that, the rules need to be:

- **Extensive**

  We aim to cover all the popular cases, including:

  - nuxt — `@nustackjs/lint-plugin-nuxt`
  - vite — `@nustackjs/lint-plugin-vite`
  - nuxt-ecosystem — popular Nuxt modules — `@nustackjs/lint-plugin-nuxt-ecosystem`
  - vueuse — `@nustackjs/lint-plugin-vueuse`

  We also reuse existing plugins where they are the best fit, for example
  `eslint-plugin-better-tailwindcss` for linting the `:ui` and `class` properties 
  when using `@nuxt/ui`.

- **Fast**

  Linting should not slow you down. If a check is slow, it gets skipped, moved to
  CI only, or disabled altogether, and then it stops catching anything. For that
  reason we plan to use [Oxlint](https://oxc.rs) as the base engine.

  Until the rules we need are available as Oxlint plugins, the module runs on
  ESLint and is ready to move over to Oxlint as support lands.

- **Zero-config and project-aware**

  Rules should apply themselves. The module detects what a project actually uses
  (Nuxt, `@nuxt/ui`, VueUse, and so on) and enables the matching rules
  automatically, instead of asking every project to wire up the same config by
  hand. Standardizing the setup is what stops each team from re-deriving it from
  scratch.

  Projects can still override or opt out when they need to, but the default should
  work out of the box.
