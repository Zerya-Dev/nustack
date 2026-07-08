# RFC 00: NuStack rationale

**Status:** Draft

NuStack exists because Nuxt projects often break at the ecosystem boundary.
Dependency updates, modules, starters, build tooling, deployment conventions, and
documentation examples all shape whether a real app stays maintainable.

[Nuxt](https://nuxt.com) has a strong ecosystem, but it moves quickly. That creates
gaps: dependency updates can break projects, examples can age out, and teams often
repeat the same setup and convention work across apps.

NuStack's goal is a stable, opinionated ecosystem for Nuxt. That means looking at the
whole picture: core framework usage, popular modules, linting, testing, starters,
layers, and upstream contributions.

The first focus is Nuxt web apps with an external API. Most of the work should
generalize to other Nuxt use cases over time.

## Direction

- **Tests**: end-to-end tests across the libraries treated as part of the stack.
- **Opinionated starters**: maintained Nuxt starters built on selected tooling.
- **Layers and modules**: common setup and conventions moved out of app code.
- **Ecosystem contributions**: fixes and improvements pushed upstream where possible.

## Principles

- **Full type safety**: defaults should preserve type information instead of hiding it.
- **Comprehensive testability**: conventions should be enforceable by automated tests.
- **Best practices over endless choice**: selected defaults reduce fragmentation.
