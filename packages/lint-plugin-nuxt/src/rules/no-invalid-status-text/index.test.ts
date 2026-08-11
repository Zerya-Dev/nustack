import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, expect, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['no-invalid-status-text']
const languageOptions = { ecmaVersion: 'latest' as const, sourceType: 'module' as const }
const error = { messageId: 'invalidStatusText' }

describe('no-invalid-status-text', () => {
  it('is enabled for recommended runtime source, including server handlers', () => {
    const recommended = nuxtConfigs()
    const errorHandling = recommended.find(config => config.name === 'nustack/nuxt/error-handling')
    const minimalRules = nuxtConfigs({ variant: 'minimal' }).flatMap(config => Object.keys(config.rules ?? {}))

    expect(errorHandling?.rules?.['@nustack/nuxt/no-invalid-status-text']).toBe('error')
    expect(errorHandling?.ignores).not.toContain('**/server/**')
    expect(minimalRules).not.toContain('@nustack/nuxt/no-invalid-status-text')
  })

  it('allows HTTP-compliant status text and values that cannot be evaluated statically', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-invalid-status-text', rule as never, {
      valid: [
        'createError({ status: 404, statusText: "Not Found" })',
        'createError({ statusText: "Not\tFound ~!" })',
        'createError({ message: "Données introuvables\\nRéessayez." })',
        'createError({ statusText })',
        'createError({ statusText: `Error $' + '{code}` })',
        'createError(details)',
        'createError("Données introuvables")',
        'showError({ statusText: "Données introuvables" })',
        'api.createError({ statusText: "Données introuvables" })',
        'function createError() {}; createError({ statusText: "Données introuvables" })',
        'function run(createError) { createError({ statusText: "Données introuvables" }) }',
        'import { createError } from "other"; createError({ statusText: "Données introuvables" })',
        'import * as api from "other"; api.createError({ statusText: "Données introuvables" })',
      ],
      invalid: [],
    })
  })

  it('reports multi-line, non-ASCII, and control characters', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-invalid-status-text', rule as never, {
      valid: [],
      invalid: [
        {
          code: 'createError({ statusText: "Not\\nFound" })',
          errors: [error],
        },
        {
          code: 'createError({ statusText: "Données introuvables" })',
          errors: [error],
        },
        {
          code: 'createError({ statusText: "Bad\\u0000Request" })',
          errors: [error],
        },
        {
          code: 'createError({ ["statusText"]: `Try\nagain` })',
          errors: [error],
        },
      ],
    })
  })

  it('recognizes Nuxt and H3 imports, aliases, and namespaces', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-invalid-status-text', rule as never, {
      valid: [],
      invalid: [
        {
          code: 'import { createError as makeError } from "#app"; makeError({ statusText: "Échec" })',
          errors: [error],
        },
        {
          code: 'import { createError } from "h3"; createError({ statusText: "Bad\\rRequest" })',
          errors: [error],
        },
        {
          code: 'import * as Nuxt from "#imports"; Nuxt.createError({ statusText: "Échec" })',
          errors: [error],
        },
        {
          code: 'import * as Nuxt from "nuxt/app"; Nuxt["createError"]({ statusText: "Échec" })',
          errors: [error],
        },
      ],
    })
  })

  it('supports TypeScript expressions', () => {
    const tester = new RuleTester({ languageOptions: { ...languageOptions, parser: tsParser } })

    tester.run('no-invalid-status-text', rule as never, {
      valid: [
        'createError({ statusText: value as string })',
        'import type { createError } from "#app"; createError({ statusText: "Échec" })',
      ],
      invalid: [
        {
          code: 'createError<{ reason: string }>(({ statusText: "Échec" } as const))',
          errors: [error],
        },
        {
          code: '(createError as typeof createError)({ statusText: (`Bad\\nRequest` as string) })',
          errors: [error],
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

    tester.run('no-invalid-status-text', rule as never, {
      valid: [],
      invalid: [
        {
          filename: 'error.vue',
          code: '<script setup lang="ts">throw createError({ statusText: "Échec" })</script>',
          errors: [error],
        },
      ],
    })
  })
})
