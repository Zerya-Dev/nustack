import type { Linter } from 'eslint'

/**
 * The type-aware layer — appended only at `depth: 'full'` (CI / `nustack lint
 * --full`). It turns on the TypeScript project service so type-information rules
 * can run, then enables the ones we standardize on. Kept out of the default
 * `quick` path because typed linting is substantially slower.
 *
 * Rules here reference antfu's renamed `ts/*` namespace (antfu renames
 * `@typescript-eslint` → `ts`). The parser itself is provided by the antfu base.
 */
export function typeAwareConfig(): Linter.Config[] {
  return [
    {
      name: 'nustack/type-aware',
      files: ['**/*.{ts,tsx,mts,cts}', '**/*.vue'],
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
      rules: {
        // Surfaces usage of APIs marked `@deprecated` — a headline full-depth check.
        'ts/no-deprecated': 'warn',
      },
    },
  ]
}
