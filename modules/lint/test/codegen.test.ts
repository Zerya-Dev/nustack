import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { generateCode } from '../src/addon'
import { EMPTY_CONTEXT } from '../src/context'

describe('generateCode', () => {
  it('serializes the context and re-exports a bound nustack factory', () => {
    const code = generateCode({
      ...EMPTY_CONTEXT,
      modules: { ...EMPTY_CONTEXT.modules, nuxtUi: true },
      tailwind: { detected: true, entryPoint: 'app/assets/css/main.css' },
    })
    expect(code).toContain('export const nustackContext')
    expect(code).toContain('"nuxtUi": true')
    expect(code).toContain('"entryPoint": "app/assets/css/main.css"')
    expect(code).toContain(`from '@nustackjs/lint/config'`)
    expect(code).toContain(`import withNuxt from './eslint.config.mjs'`)
    expect(code).toContain('export function nustack')
    expect(code).toContain('export const nustackLint = nustack')
    expect(code).toContain('export default nustack()')
  })
})

// Validates the full module → prepare → context pipeline using the playground
// that `nuxt prepare` already generated. Run `pnpm dev:prepare` first.
describe('playground integration', () => {
  const file = fileURLToPath(new URL('../playground/.nuxt/nustack-eslint.mjs', import.meta.url))

  it('generated the context file during nuxt prepare', () => {
    expect(existsSync(file)).toBe(true)
  })

  it('detected @nuxt/ui, tailwind, auto-imports and components', async () => {
    const { nustackContext } = await import(file)
    expect(nustackContext.modules.nuxtUi).toBe(true)
    expect(nustackContext.tailwind.detected).toBe(true)
    expect(nustackContext.tailwind.entryPoint).toBeTruthy()
    expect(nustackContext.autoImports).toContain('ref')
    expect(nustackContext.components).toContain('UButton')
  })
})
