import { RuleTester } from 'eslint'
import { describe, expect, it } from 'vitest'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['prefer-lazy-data-option']
const languageOptions = { ecmaVersion: 'latest' as const, sourceType: 'module' as const }

describe('prefer-lazy-data-option', () => {
  it('is enabled in the recommended app config', () => {
    const enabledRules = nuxtConfigs().flatMap(config => Object.keys(config.rules ?? {}))
    expect(enabledRules).toContain('@nustack/nuxt/prefer-lazy-data-option')
    expect(enabledRules).not.toContain('@nustack/nuxt/lazy-fetch-style')
  })

  it('requires the lazy option style', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('prefer-lazy-data-option', rule as never, {
      valid: [
        'useFetch(\'/api/posts\', { lazy: true })',
        'useAsyncData(() => loadPosts(), { lazy: true })',
        'useAsyncData(\'posts\', () => loadPosts(), { lazy: true })',
        'useFetch(\'/api/posts\')',
        'useAsyncData(\'posts\', () => loadPosts())',
        'api.useLazyFetch(\'/api/posts\')',
        'api.useLazyAsyncData(() => loadPosts())',
      ],
      invalid: [
        {
          code: 'useLazyFetch(\'/api/posts\')',
          errors: [{
            messageId: 'preferLazyOption',
            data: { actual: 'useLazyFetch', preferred: 'useFetch' },
          }],
        },
        {
          code: 'useLazyAsyncData(() => loadPosts())',
          errors: [{
            messageId: 'preferLazyOption',
            data: { actual: 'useLazyAsyncData', preferred: 'useAsyncData' },
          }],
        },
        {
          code: 'useLazyAsyncData(\'posts\', () => loadPosts())',
          errors: [{
            messageId: 'preferLazyOption',
            data: { actual: 'useLazyAsyncData', preferred: 'useAsyncData' },
          }],
        },
      ],
    })
  })
})
