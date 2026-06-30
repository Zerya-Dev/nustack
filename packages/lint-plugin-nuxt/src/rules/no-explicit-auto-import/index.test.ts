import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-explicit-auto-import']

describe('no-explicit-auto-import', () => {
  it('reports imports that Nuxt already auto-imports', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: tsParser } })
    const options = [{ imports: ['ref', 'computed', 'useRuntimeConfig'], components: ['AppButton'] }]

    tester.run('no-explicit-auto-import', rule as never, {
      valid: [
        { code: 'import type { Ref } from \'vue\'', options },
        { code: 'import { watch } from \'vue\'', options },
        { code: 'import AppButton from \'../not-components/AppButton.vue\'', options },
      ],
      invalid: [
        {
          code: 'import { ref } from \'vue\'\nconst value = ref(1)',
          output: '\nconst value = ref(1)',
          options,
          errors: [{ messageId: 'noExplicitAutoImport' }],
        },
        {
          code: 'import { ref, watch } from \'vue\'\nwatch(ref(1), () => {})',
          output: 'import { watch } from \'vue\'\nwatch(ref(1), () => {})',
          options,
          errors: [{ messageId: 'noExplicitAutoImport' }],
        },
        {
          code: 'import { useRuntimeConfig } from \'#imports\'\nuseRuntimeConfig()',
          output: '\nuseRuntimeConfig()',
          options,
          errors: [{ messageId: 'noExplicitAutoImport' }],
        },
        {
          code: 'import AppButton from \'~/components/AppButton.vue\'\nconsole.log(AppButton)',
          output: '\nconsole.log(AppButton)',
          options,
          errors: [{ messageId: 'noExplicitAutoImport' }],
        },
      ],
    })
  })
})
