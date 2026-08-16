import { describe, it } from 'vitest'
import { nuxtUiPlugin } from '../../../src/index.js'
import { ruleTester as tester } from '../../rule-tester.js'

/** Every rule built from `preferUComponent`, so the per-rule files only carry what is specific. */
const RULES = [
  { name: 'prefer-u-button', tag: 'button', component: 'Button' },
  { name: 'prefer-u-kbd', tag: 'kbd', component: 'Kbd' },
  { name: 'prefer-u-link', tag: 'a', component: 'Link' },
  { name: 'prefer-u-modal', tag: 'dialog', component: 'Modal' },
  { name: 'prefer-u-progress', tag: 'progress', component: 'Progress' },
  { name: 'prefer-u-separator', tag: 'hr', component: 'Separator' },
  { name: 'prefer-u-table', tag: 'table', component: 'Table' },
] as const

const settings = (prefix: string) => ({ '@nustack/nuxt-ui': { enabled: true, prefix } })

describe.each(RULES)('$name', ({ name, tag, component }) => {
  const rule = nuxtUiPlugin.rules[name]
  const messageId = `preferU${component}`

  it('reports the native tag and nothing that only looks like it', () => {
    tester.run(name, rule, {
      valid: [
        // The Nuxt UI component itself, and a component that merely shares the native name.
        { code: `<template><U${component} /></template>` },
        { code: `<template><${component} /></template>` },
        // Outside the template the tag is just an identifier or a string.
        { code: `<script setup>\nconst ${tag} = 1\nconst html = '<${tag}></${tag}>'\n</script>\n<template><div /></template>` },
      ],
      invalid: [
        {
          code: `<template><${tag} /></template>`,
          errors: [{ messageId, data: { component: `U${component}`, tag } }],
        },
      ],
    })
  })

  it('spells the replacement with the configured prefix', () => {
    tester.run(name, rule, {
      valid: [
        { code: `<template><Nu${component} /></template>`, settings: settings('Nu') },
      ],
      invalid: [
        {
          code: `<template><${tag} /></template>`,
          settings: settings('Nu'),
          errors: [{ messageId, data: { component: `Nu${component}`, tag } }],
        },
      ],
    })
  })
})
