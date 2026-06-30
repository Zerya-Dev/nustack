import antfu from '@antfu/eslint-config'

// One flat config lints the whole workspace from the root. The exceptions own
// their own configs and lint themselves:
//   - modules/* — @nustackjs/lint dogfoods its own nustack() factory
//   - starters/* — not a workspace member; ships its own eslint.config.ts
export default antfu(
  {
    type: 'lib',
    typescript: true,
    // Rule docs (src/rules/**/index.md) embed intentionally-partial TS/Vue code
    // fences that don't parse on their own; linting markdown here is just noise.
    markdown: false,
    ignores: [
      'modules/**',
      'starters/**',
      '**/dist',
      '**/.nuxt',
      '**/playground',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': ['error', 'always'],
      'ts/explicit-function-return-type': 'off',
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
)
