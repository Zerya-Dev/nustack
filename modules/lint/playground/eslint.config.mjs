// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import { nustackLint } from './.nuxt/nustack-eslint.mjs'

// Zero-config: antfu base + Nuxt context + Tailwind/Nuxt UI pack, all detected.
export default nustackLint(withNuxt())
