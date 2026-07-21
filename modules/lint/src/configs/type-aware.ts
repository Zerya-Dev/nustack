import type { Linter } from 'eslint'

/** Type-aware rules enabled at full analysis depth. */
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
        'ts/no-deprecated': 'warn',
      },
    },
  ]
}
