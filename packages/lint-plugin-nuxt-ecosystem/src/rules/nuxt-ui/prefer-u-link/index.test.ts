import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['prefer-u-link']

describe('prefer-u-link', () => {
  it('reports raw anchors in Vue templates', () => {
    tester.run('prefer-u-link', rule, {
      valid: [
        { code: '<template><ULink to="/home">Home</ULink></template>' },
        { code: '<template><svg><a href="#x" /></svg></template>' },
      ],
      invalid: [
        {
          code: '<template><a href="/home">Home</a></template>',
          errors: [{ messageId: 'preferULink', data: { component: 'ULink', tag: 'a' } }],
        },
        {
          code: '<template><a href="/home">Home</a></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' } },
          errors: [{ messageId: 'preferULink', data: { component: 'NuLink', tag: 'a' } }],
        },
      ],
    })
  })
})
