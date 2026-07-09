import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { createContext, detectStandaloneContext } from '../src/context/detect'

// Detection now resolves modules through node resolution (exsolve) instead of
// parsing package.json, so a fixture's declared deps aren't automatically installed.
// Mock the resolver to make only `@nuxt/ui` (and only from the nuxt-ui fixture)
// resolvable — the Tailwind entry point is still found by the real CSS scan.
vi.mock('exsolve', () => ({
  resolveModulePath: (id: string, opts: { from?: string }) => {
    const from = String(opts?.from ?? '')
    if (from.includes('standalone-nuxt-ui') && id === '@nuxt/ui')
      return '/virtual/node_modules/@nuxt/ui/index.mjs'
    return undefined
  },
}))

const NUXT_UI_FIXTURE = fileURLToPath(new URL('./fixtures/standalone-nuxt-ui', import.meta.url))
const PLAIN_FIXTURE = fileURLToPath(new URL('./fixtures/standalone-plain', import.meta.url))

describe('detectStandaloneContext', () => {
  it('detects @nuxt/ui (node resolution) and a Tailwind CSS entry point (css scan)', () => {
    const ctx = detectStandaloneContext(NUXT_UI_FIXTURE)
    expect(ctx.modules.nuxtUi).toBe(true)
    expect(ctx.tailwind.detected).toBe(true)
    expect(ctx.tailwind.entryPoint).toBe('assets/css/main.css')
  })

  it('reports nothing detected for a plain project', () => {
    const ctx = detectStandaloneContext(PLAIN_FIXTURE)
    expect(ctx.modules.nuxtUi).toBe(false)
    expect(ctx.tailwind.detected).toBe(false)
    expect(ctx.tailwind.entryPoint).toBeNull()
  })

  it('leaves autoImports/components empty — no Nuxt registry to read outside Nuxt', () => {
    const ctx = detectStandaloneContext(NUXT_UI_FIXTURE)
    expect(ctx.autoImports).toEqual([])
    expect(ctx.components).toEqual([])
  })

  it('falls back to a safe empty context when nothing resolves', () => {
    const ctx = detectStandaloneContext(fileURLToPath(new URL('./fixtures', import.meta.url)))
    expect(ctx.modules.nuxtUi).toBe(false)
    expect(ctx.tailwind.detected).toBe(false)
  })
})

describe('createContext', () => {
  it('fills gaps from EMPTY_CONTEXT, accepting partial nested objects', () => {
    // Only a single nested `modules` key is supplied — the rest fills from EMPTY_CONTEXT.
    const ctx = createContext({ modules: { nuxtUi: true }, autoImports: ['ref'] })
    expect(ctx.modules.nuxtUi).toBe(true)
    expect(ctx.modules.pinia).toBe(false)
    expect(ctx.autoImports).toEqual(['ref'])
    expect(ctx.components).toEqual([])
    expect(ctx.tailwind).toEqual({ detected: false, entryPoint: null })
  })

  it('with no partial returns the empty context', () => {
    const ctx = createContext()
    expect(ctx.modules.nuxtUi).toBe(false)
    expect(ctx.autoImports).toEqual([])
  })
})
