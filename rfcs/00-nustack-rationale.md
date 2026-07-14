# RFC 00: NuStack rationale

NuStack's goal is to provide a stable, opinionated ecosystem for building
production Nuxt applications.

It is not a new framework and it is not a fork of Nuxt. It is a maintained way
to use Nuxt: selected modules, conventions, linting, testing, starters, layers,
and upstream contributions.

## Reasoning

Nuxt is a great framework with a strong community and ecosystem. But when
building larger real-world projects, it can often feel like every team
needs to discover the same things from scratch. It often leads to
frustration, hard to prioritize issues and more time wasted.

In a mature framework ecosystem, common paths should already be worn out. There
should be established practices, trusted defaults, proven libraries, and tools
tested across many different projects. That is what NuStack wants to provide for
Nuxt.

There are plenty of starters and boilerplates out there, but few look at the
ecosystem as a whole. In the age of AI it is easy to generate fifty vibe-coded
templates; it is much harder to build something that is actually worth using and
maintaining over time. NuStack aims for the latter.

The JavaScript ecosystem moves fast. New libraries appear, existing tools get
rewritten, and recommended patterns change often. This brings a lot of good
things, but also real problems: a random patch update can break your app, a guide
can describe an outdated pattern, and a decision that looked correct yesterday
can become something you need to rewrite tomorrow.

There are usually two modes of work:

* building the product;
* researching tools and improving the OSS ecosystem.

Both are valuable, but they should not have to be combined all the time. When
working on your product, you usually do not want to think about which library 
to pick or which Rust-based linter to test next. But if you enjoy that kind 
of work, you can join us on the journey of "OSS tinkering" and picking the 
best tools for the stack.

## Solution

- NuStack is an initiative to create a paved road for Nuxt.
- NuStack should make building serious Nuxt applications more predictable.
- NuStack doesn't aim to fork Nuxt.

Developers should be able to start from tested defaults, avoid repeating the same
tooling decisions, upgrade with more confidence, and focus more on building the
product.

The goal is not to compete with Nuxt. The goal is to choose a strong default way
to use it, test it in real projects, standardize it, and improve it over time.

Whenever possible, improvements should be pushed upstream to Nuxt, Nuxt modules,
and related libraries. This way, the whole ecosystem benefits, and NuStack does
not become a separate fork that divides the community.

## Principles

### Best practices over endless choice

NuStack should provide strong defaults based on real projects. We select the
best tools for the job and standardize on them to reduce fragmentation.
Supporting multiple alternatives that do almost the same thing vastly increases
the resources needed to maintain the stack.

This applies to the things that matter most. NuStack is still just Nuxt, so a
project can always diverge and do what it wants. But there should be one
recommended path that is tested, documented, and improved over time.

### Stability, not outdated

NuStack should not chase every new library or pattern. The stack should prefer
stable, well-tested tools, but at the same time it should not stay on old,
legacy tooling when clearly better alternatives exist.

Dependency upgrades should be tested as part of the stack before being
recommended.

### Everything should be testable

Conventions should be enforceable by automated tests. There should be no rules
that live only in the documentation. Mandatory linting, tests, and type checks
are the way to actually enforce them.

For starters and modules, we should also implement comprehensive tests to follow
the same principle of testing everything that we deploy.

### Community first

NuStack is possible thanks to the community, it should take from it
and give back in the form of upstream improvements that will benefit everybody.

When problems are found, the preferred solution should be to contribute fixes
upstream whenever possible. NuStack should be built with the community, not in
isolation. Without community feedback, RFCs, and real-world usage, we cannot
pick the right defaults or improve them over time.

## How we get there

NuStack will focus on:

* maintained Nuxt starters;
* shared linting, formatting, TypeScript, and testing setup;
* reusable layers and modules;
* end-to-end tests across the selected stack;
* documentation for common production patterns;
* tested upgrade paths;
* upstream contributions.
