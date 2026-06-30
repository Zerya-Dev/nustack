import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-namespace-import']

describe('no-namespace-import', () => {
  it('reports namespace imports in TypeScript files', () => {
    const tester = new RuleTester({
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    })

    tester.run('no-namespace-import', rule as never, {
      valid: [
        { code: 'import { useStorage } from \'@vueuse/core\'' },
        { code: 'import * as Vue from \'vue\'' },
      ],
      invalid: [
        {
          code: 'import * as VueUse from \'@vueuse/core\'',
          errors: [{ messageId: 'noNamespace' }],
        },
      ],
    })
  })

  it('reports namespace imports in Vue script setup', () => {
    const tester = new RuleTester({
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser },
    })

    tester.run('no-namespace-import', rule as never, {
      valid: [
        {
          filename: 'component.vue',
          code: `<script setup lang="ts">\nimport { useStorage } from '@vueuse/core'\n</script>`,
        },
      ],
      invalid: [
        {
          filename: 'component.vue',
          code: `<script setup lang="ts">\nimport * as VueUse from '@vueuse/core'\n</script>`,
          errors: [{ messageId: 'noNamespace' }],
        },
      ],
    })
  })
})
