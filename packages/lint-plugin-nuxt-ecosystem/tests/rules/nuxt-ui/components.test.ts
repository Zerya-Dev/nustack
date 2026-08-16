import { describe, it } from 'vitest'
import { nuxtUiPlugin } from '../../../src/index.js'
import { ruleTester as tester } from '../../rule-tester.js'

const iconButton = nuxtUiPlugin.rules['require-icon-button-label']
const settings = (prefix: string) => ({ '@nustack/nuxt-ui': { enabled: true, prefix } })
function sfc(script: string, template: string) {
  return `<script setup>\n${script}\n</script>\n<template>${template}</template>`
}

describe('component identification', () => {
  it('matches every auto-import spelling of a component', () => {
    tester.run('require-icon-button-label', iconButton, {
      valid: [],
      invalid: [
        { code: '<template><UButton icon="i-lucide-x" /></template>', errors: 1 },
        { code: '<template><u-button icon="i-lucide-x" /></template>', errors: 1 },
        { code: '<template><LazyUButton icon="i-lucide-x" /></template>', errors: 1 },
        { code: '<template><lazy-u-button icon="i-lucide-x" /></template>', errors: 1 },
      ],
    })
  })

  it('honours a configured ui.prefix', () => {
    tester.run('require-icon-button-label', iconButton, {
      valid: [
        { code: '<template><UButton icon="i-lucide-x" /></template>', settings: settings('Nu') },
      ],
      invalid: [
        { code: '<template><NuButton icon="i-lucide-x" /></template>', settings: settings('Nu'), errors: 1 },
        { code: '<template><nu-button icon="i-lucide-x" /></template>', settings: settings('Nu'), errors: 1 },
        { code: '<template><Button icon="i-lucide-x" /></template>', settings: settings(''), errors: 1 },
      ],
    })
  })

  it('follows named imports through an alias', () => {
    tester.run('require-icon-button-label', iconButton, {
      valid: [
        { code: sfc('import { MyThing } from \'#components\'', '<MyThing icon="i-lucide-x" />') },
      ],
      invalid: [
        { code: sfc('import { UButton as IconButton } from \'#components\'', '<IconButton icon="i-lucide-x" />'), errors: 1 },
        { code: sfc('import { UButton as IconButton } from \'@nuxt/ui\'', '<IconButton icon="i-lucide-x" />'), errors: 1 },
        { code: sfc('import Btn from \'@nuxt/ui/components/Button.vue\'', '<Btn icon="i-lucide-x" />'), errors: 1 },
      ],
    })
  })

  it('respects local shadowing of a Nuxt UI name', () => {
    tester.run('require-icon-button-label', iconButton, {
      valid: [
        { code: sfc('import UButton from \'./MyButton.vue\'', '<UButton icon="i-lucide-x" />') },
        { code: sfc('import { UButton } from \'~/components/ui\'', '<UButton icon="i-lucide-x" />') },
      ],
      invalid: [],
    })
  })

  it('resolves <component :is> only when the target is static', () => {
    tester.run('require-icon-button-label', iconButton, {
      valid: [
        { code: '<template><component :is="resolved" icon="i-lucide-x" /></template>' },
        { code: '<template><component :is="map[key]" icon="i-lucide-x" /></template>' },
      ],
      invalid: [
        { code: '<template><component is="UButton" icon="i-lucide-x" /></template>', errors: 1 },
        { code: '<template><component :is="\'UButton\'" icon="i-lucide-x" /></template>', errors: 1 },
        { code: sfc('import { UButton } from \'#components\'', '<component :is="UButton" icon="i-lucide-x" />'), errors: 1 },
      ],
    })
  })

  it('does not mistake native tags for components', () => {
    tester.run('no-conflicting-state-props', nuxtUiPlugin.rules['no-conflicting-state-props'], {
      valid: [
        { code: '<template><ul default-value="a" model-value="b" /></template>' },
        { code: '<template><use default-open open /></template>' },
        { code: '<template><UserCard default-value="a" model-value="b" /></template>' },
      ],
      invalid: [
        { code: '<template><u-modal default-open open /></template>', errors: 1 },
      ],
    })
  })

  it('reports multi-word components with their real casing', () => {
    tester.run('require-form-control-label', nuxtUiPlugin.rules['require-form-control-label'], {
      valid: [],
      invalid: [
        {
          filename: 'c.vue',
          code: '<template><UInputMenu :items="items" /></template>',
          errors: [{ messageId: 'missingLabel', data: { component: 'UInputMenu' } }],
        },
        {
          filename: 'c.vue',
          code: '<template><u-checkbox-group :items="items" /></template>',
          errors: [{ messageId: 'missingLabel', data: { component: 'UCheckboxGroup' } }],
        },
      ],
    })
  })

  it('resolves renamed components across spellings', () => {
    tester.run('no-deprecated-components', nuxtUiPlugin.rules['no-deprecated-components'], {
      valid: [
        { code: sfc('import UButtonGroup from \'./ButtonGroup.vue\'', '<UButtonGroup />') },
      ],
      invalid: [
        {
          filename: 'c.vue',
          code: '<template><u-button-group /></template>',
          output: '<template><u-field-group /></template>',
          errors: [{ messageId: 'deprecated', data: { name: 'UButtonGroup', replacement: 'UFieldGroup' } }],
        },
        {
          filename: 'c.vue',
          code: '<template><LazyUPageMarquee /></template>',
          output: '<template><LazyUMarquee /></template>',
          errors: [{ messageId: 'deprecated', data: { name: 'UPageMarquee', replacement: 'UMarquee' } }],
        },
      ],
    })
  })
})
