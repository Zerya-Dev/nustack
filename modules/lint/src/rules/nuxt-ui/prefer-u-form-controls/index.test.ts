import { describe, vue } from '../../rule-tester'
import { rule as preferUFormControls } from './index'

describe('nuxt-ui/prefer-u-form-controls', () => {
  vue.run('nuxt-ui/prefer-u-form-controls', preferUFormControls, {
    valid: [
      `<template><UInput /></template>`,
      `<template><input data-raw></template>`,
    ],
    invalid: [
      { code: `<template><input></template>`, errors: [{ messageId: 'preferUFormControl' }] },
      { code: `<template><textarea /></template>`, errors: [{ messageId: 'preferUFormControl' }] },
    ],
  })
})
