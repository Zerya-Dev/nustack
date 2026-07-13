// @ts-check
import { nustack } from './.nuxt/nustack-eslint.mjs'

// Zero-config: antfu base + Nuxt context + Tailwind/Nuxt UI pack, all detected.
export default nustack().append({
  name: 'playground/standalone-package',
  files: ['package.json'],
  rules: {
    'pnpm/json-enforce-catalog': 'off',
    'pnpm/json-prefer-workspace-settings': 'off',
    'pnpm/json-valid-catalog': 'off',
  },
})
