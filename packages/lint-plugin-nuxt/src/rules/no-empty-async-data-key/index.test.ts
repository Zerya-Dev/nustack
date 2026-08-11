import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, expect, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['no-empty-async-data-key']
const languageOptions = { ecmaVersion: 'latest' as const, sourceType: 'module' as const }
const error = (name: string) => ({ messageId: 'emptyKey', data: { name } })

describe('no-empty-async-data-key', () => {
  it('is enabled in the recommended app config', () => {
    const enabledRules = nuxtConfigs().flatMap(config => Object.keys(config.rules ?? {}))
    expect(enabledRules).toContain('@nustack/nuxt/no-empty-async-data-key')
  })

  it('allows non-empty, dynamic, and compiler-generated keys', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-empty-async-data-key', rule as never, {
      valid: [
        'useAsyncData("users", () => loadUsers())',
        'useLazyAsyncData(`users`, () => loadUsers())',
        'useAsyncData(" ", () => loadUsers())',
        'useAsyncData(key, () => loadUsers())',
        'useAsyncData(() => loadUsers())',
        'useAsyncData(() => loadUsers(), { server: false })',
        'function useAsyncData() {}; useAsyncData("", () => loadUsers())',
        'function load(useLazyAsyncData) { useLazyAsyncData("", () => loadUsers()) }',
        'import { useAsyncData } from "other"; useAsyncData("", () => loadUsers())',
        'import { useAsyncData as loadData } from "#app"; function load(loadData) { loadData("", () => loadUsers()) }',
        'import * as Nuxt from "#imports"; function load(Nuxt) { Nuxt.useAsyncData("", () => loadUsers()) }',
        'api.useAsyncData("", () => loadUsers())',
      ],
      invalid: [],
    })
  })

  it('reports empty string and template literal keys', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-empty-async-data-key', rule as never, {
      valid: [],
      invalid: [
        {
          code: 'useAsyncData("", () => loadUsers())',
          errors: [error('useAsyncData')],
        },
        {
          code: 'useLazyAsyncData(``, () => loadUsers())',
          errors: [error('useLazyAsyncData')],
        },
      ],
    })
  })

  it('recognizes Nuxt imports, aliases, and namespaces', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-empty-async-data-key', rule as never, {
      valid: [],
      invalid: [
        {
          code: 'import { useAsyncData as loadData } from "#app"; loadData("", () => loadUsers())',
          errors: [error('useAsyncData')],
        },
        {
          code: 'import { useLazyAsyncData as loadData } from "nuxt/app"; loadData(``, () => loadUsers())',
          errors: [error('useLazyAsyncData')],
        },
        {
          code: 'import * as Nuxt from "#imports"; Nuxt.useAsyncData("", () => loadUsers())',
          errors: [error('useAsyncData')],
        },
        {
          code: 'import * as Nuxt from "#app"; Nuxt["useLazyAsyncData"]("", () => loadUsers())',
          errors: [error('useLazyAsyncData')],
        },
      ],
    })
  })

  it('supports TypeScript expressions', () => {
    const tester = new RuleTester({ languageOptions: { ...languageOptions, parser: tsParser } })

    tester.run('no-empty-async-data-key', rule as never, {
      valid: [
        'useAsyncData<Post[]>(key as string, () => loadUsers())',
        'import type { useAsyncData } from "#app"; useAsyncData("", () => loadUsers())',
      ],
      invalid: [
        {
          code: 'useAsyncData<Post[]>("" as string, () => loadUsers())',
          errors: [error('useAsyncData')],
        },
        {
          code: '(useLazyAsyncData as typeof useLazyAsyncData)<Post[]>(``, () => loadUsers())',
          errors: [error('useLazyAsyncData')],
        },
      ],
    })
  })

  it('supports Vue script setup', () => {
    const tester = new RuleTester({
      languageOptions: {
        ...languageOptions,
        parser: vueParser,
        parserOptions: { parser: tsParser },
      },
    })

    tester.run('no-empty-async-data-key', rule as never, {
      valid: [
        {
          filename: 'users.vue',
          code: '<script setup lang="ts">useAsyncData("users", () => loadUsers())</script>',
        },
      ],
      invalid: [
        {
          filename: 'users.vue',
          code: '<script setup lang="ts">useAsyncData("", () => loadUsers())</script>',
          errors: [error('useAsyncData')],
        },
      ],
    })
  })
})
