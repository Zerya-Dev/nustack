# Roadmap

## ESLint is temporary

The current engine is ESLint. That's a deliberate stepping stone, not the destination.

**The v1.0 goal is a full migration to [oxlint](https://oxc.rs/docs/guide/usage/linter)**
— a Rust-based linter that's orders of magnitude faster than ESLint. The entire public
surface of nustack (`variant`, `depth`, the per-concern options, the detected context) is
kept **engine-agnostic** on purpose, so swapping the engine underneath stays an internal
change rather than a breaking one. The `full`-depth layer maps onto oxlint's capability
categories.

### What's blocking it

oxlint does not yet fully support Vue SFCs (linting inside `<template>` and the
SFC tag structure). Until it does, the headline Tailwind/Nuxt UI `:ui` linting and the
Vue conventions can't run on oxlint. So:

- **now → v1.0:** ESLint engine, oxlint-shaped API.
- **v1.0:** oxlint engine once Vue SFC support lands upstream.

We track oxlint's Vue support and will migrate concern-by-concern as capabilities arrive.

## Planned: `nustack lint` CLI

Depth, caching and changed-file filtering currently lean on ESLint's own flags
(`eslint --cache`, lint-staged, `NUSTACK_LINT_DEPTH`). A dedicated CLI is planned to make
this first-class and engine-agnostic:

```bash
nustack lint --changed          # only files changed vs the base branch
nustack lint --quick            # fast, syntactic (default)
nustack lint --full             # type-aware / cross-file (sets NUSTACK_LINT_DEPTH=full)
```

It will wrap caching, git-based change detection, and the quick/full depth selection, and
later target oxlint or ESLint transparently.

## Candidate rules

- A props-style rule standardizing on JS-native reactive-props-destructure defaults
  (illustrates the "pick one explicit way" thesis: of the several ways to declare prop
  defaults, standardize on the native one).
- More `pedantic` Nuxt/Vue conventions as the community settles on them.
