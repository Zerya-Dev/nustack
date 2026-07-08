# RFC 01: Nustack Lint

**Status:** Draft

NuStack treats linting as an ecosystem problem, not just a Vue or TypeScript problem.
Nuxt projects combine Nuxt core, Vite, modules, VueUse, Tailwind, runtime config,
auto-imports, and deployment conventions. Generic linting catches only part of that
surface, so `@nustackjs/lint` composes project-aware checks for the stack a project
actually uses.

Linting was always worth it. In the era of AI-generated code it's load-bearing: every
inconsistency an agent produces is something a human flags in review or has to pre-empt
in `agents.md`. So the nustack linter (`@nustackjs/lint`) doesn't try to be "correct" —
it picks **one explicit way per decision and enforces it**, so people and agents stop
re-litigating style. You can disagree with any specific pick and override it; the value
is the consistency, not the choice.

Rules should be grounded in official docs, conventions, and recommendations for the
tool they target. The goal is not arbitrary preference; it is moving known production
failure modes and recurring review comments into automated checks.

## Module and plugin split

The Nuxt module is the default path because it can detect project context, generate the
right config, and keep the base config, `@nuxt/eslint`, and NuStack rule packages upgraded
together.

The rules also ship as standalone ESLint/Oxlint-ready plugins with no Nuxt dependency.
That lets projects adopt one slice, such as runtime config or VueUse rules, without
taking the full opinionated module.

## Engine: ESLint now, oxlint later

We ship on **ESLint** today because it's the only engine that can lint Vue SFCs properly
(templates, the `:ui` prop, SFC structure) and has the plugin ecosystem we compose
(antfu, eslint-plugin-vue, better-tailwindcss).

But ESLint is a stepping stone. **v1.0's goal is a full migration to oxlint** for speed.
The whole public API (`variant`, `depth`, per-concern options, detected context) is kept
engine-agnostic on purpose so the swap is internal, not breaking. The blocker is oxlint's
Vue SFC support — until that lands upstream, we stay on ESLint.

## Two knobs, not audience tiers

Strictness and cost are different axes and live in different places:

- **`variant`** (`minimal` / `recommended` / `pedantic`) — how opinionated. Static, set
  once in `eslint.config.ts`.
- **`depth`** (`quick` / `full`) — how expensive. Per-run, via `NUSTACK_LINT_DEPTH`. You
  run quick locally and full in CI; type-aware checks live in `full`.

Tiers are not about who you are — every project uses both knobs at different moments.

## Config lives in `eslint.config.ts`, not `nuxt.config`

The Nuxt module only detects context and codegens. No `nustack` key polluting
`nuxt.config`. `@nuxt/eslint` is bundled as a dependency (nothing magical — no
auto-install, wiring stays explicit) so consumers install one package.

See `modules/lint/DEVELOPMENT.md` for the full design contract.
