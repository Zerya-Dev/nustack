import { describe, vue } from '../../rule-tester'
import { rule as preferUButton } from './index'

describe('nuxt-ui/prefer-u-button', () => {
  vue.run('nuxt-ui/prefer-u-button', preferUButton, {
    valid: [
      `<template><UButton /></template>`,
      `<template><button data-raw>ok</button></template>`,
    ],
    invalid: [
      { code: `<template><button>x</button></template>`, errors: [{ messageId: 'preferUButton' }] },
    ],
  })
})
