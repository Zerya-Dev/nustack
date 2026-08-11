import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, expect, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['no-unserializable-use-state']
const languageOptions = { ecmaVersion: 'latest' as const, sourceType: 'module' as const }

describe('no-unserializable-use-state', () => {
  it('keeps the rule enabled with custom serializable constructors', () => {
    const appConfig = nuxtConfigs({ payloadSerializableConstructors: ['DateTime'] })
      .find(config => config.name === 'nustack/nuxt/app')

    expect(appConfig?.rules?.['@nustack/nuxt/no-unserializable-use-state']).toEqual([
      'error',
      { allowConstructors: ['DateTime'] },
    ])
  })

  it('allows only explicitly configured custom constructors', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-unserializable-use-state', rule as never, {
      valid: [
        { code: 'useState(() => new DateTime())', options: [{ allowConstructors: ['DateTime'] }] },
        { code: 'useState(() => new Prisma.Decimal(1))', options: [{ allowConstructors: ['Prisma.Decimal'] }] },
        { code: 'useState(() => new Domain.Promise())', options: [{ allowConstructors: ['Domain.Promise'] }] },
      ],
      invalid: [
        {
          code: 'useState(() => ({ date: new DateTime(), user: new User(), callback: () => {}, token: Symbol("x") }))',
          options: [{ allowConstructors: ['DateTime'] }],
          errors: [
            { messageId: 'unserializable', data: { type: 'an instance of `User`' } },
            { messageId: 'unserializable', data: { type: 'a function' } },
            { messageId: 'unserializable', data: { type: 'a symbol' } },
          ],
        },
        {
          code: 'useState(() => Promise.resolve({ ready: true }))',
          options: [{ allowConstructors: ['Promise'] }],
          errors: [{ messageId: 'unserializable', data: { type: 'a Promise' } }],
        },
        {
          code: 'useState(() => new Promise(resolve => resolve()))',
          options: [{ allowConstructors: ['Promise'] }],
          errors: [{ messageId: 'unserializable', data: { type: 'a Promise' } }],
        },
        {
          code: 'useState(() => new globalThis.Promise(resolve => resolve()))',
          options: [{ allowConstructors: ['globalThis.Promise'] }],
          errors: [{ messageId: 'unserializable', data: { type: 'a Promise' } }],
        },
      ],
    })
  })

  it('allows values supported by Nuxt default payload serialization', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-unserializable-use-state', rule as never, {
      valid: [
        'useState()',
        'useState(42)',
        'useState(() => ({ count: 0, nested: [true, null, undefined] }))',
        'useState(\'created\', () => new Date())',
        'useState(key, () => ({ ready: true }))',
        'useState(() => ({ map: new Map(), set: new Set(), url: new URL(\'/\', base) }))',
        'useState(() => new Uint8Array([1, 2]))',
        'useState(() => Temporal.Instant.from(\'2020-01-01T00:00Z\'))',
        'useState(() => createProjectState())',
        'api.useState(() => new User())',
        'useState(() => ({ value: ref(1), reactive: reactive({ ok: true }) }))',
      ],
      invalid: [
        {
          code: 'useState(() => () => 42)',
          errors: [{ messageId: 'unserializable', data: { type: 'a function' } }],
        },
        {
          code: 'useState(\'user\', () => new User())',
          errors: [{ messageId: 'unserializable', data: { type: 'an instance of `User`' } }],
        },
        {
          code: 'useState(() => Symbol(\'state\'))',
          errors: [{ messageId: 'unserializable', data: { type: 'a symbol' } }],
        },
        {
          code: 'useState(async () => ({ ready: true }))',
          errors: [{ messageId: 'unserializable', data: { type: 'a Promise' } }],
        },
        {
          code: 'useState(() => ({ nested: [{ transform() {} }], [Symbol.iterator]: true }))',
          errors: [
            { messageId: 'unserializable', data: { type: 'a function' } },
            { messageId: 'unserializable', data: { type: 'a symbol-keyed property' } },
          ],
        },
        {
          code: 'useState(() => { if (enabled) return { callback: handler => handler() }; return new Error() })',
          errors: [
            { messageId: 'unserializable', data: { type: 'a function' } },
            { messageId: 'unserializable', data: { type: 'an instance of `Error`' } },
          ],
        },
      ],
    })
  })

  it('unwraps TypeScript expressions', () => {
    const tester = new RuleTester({ languageOptions: { ...languageOptions, parser: tsParser } })

    tester.run('no-unserializable-use-state', rule as never, {
      valid: ['useState(() => ({ count: 1 } satisfies State))'],
      invalid: [{
        code: 'useState<State>(() => (new User() as State))',
        errors: [{ messageId: 'unserializable', data: { type: 'an instance of `User`' } }],
      }],
    })
  })

  it('works in Vue script blocks', () => {
    const tester = new RuleTester({
      languageOptions: {
        ...languageOptions,
        parser: vueParser,
        parserOptions: { parser: tsParser },
      },
    })

    tester.run('no-unserializable-use-state', rule as never, {
      valid: [{ filename: 'state.vue', code: '<script setup lang="ts">useState(() => ({ count: 0 }))</script>' }],
      invalid: [{
        filename: 'state.vue',
        code: '<script setup lang="ts">useState(() => ({ callback: () => true }))</script>',
        errors: [{ messageId: 'unserializable', data: { type: 'a function' } }],
      }],
    })
  })
})
