import { rules } from '../../catalog'
import { describe, js, vue } from '../../rule-tester'

const rule = rules['vueuse/no-namespace-import']!

describe('vueuse/no-namespace-import', () => {
  js.run('vueuse/no-namespace-import ts', rule, {
    valid: [
      {
        code: `import { useStorage } from '@vueuse/core'`,
      },
    ],
    invalid: [
      {
        code: `import * as VueUse from '@vueuse/core'`,
        errors: [{ messageId: 'noNamespace' }],
      },
    ],
  })

  vue.run('vueuse/no-namespace-import vue', rule, {
    valid: [
      {
        filename: 'component.vue',
        code: `
          <script setup lang="ts">
          import { useStorage } from '@vueuse/core'
          </script>
        `,
      },
    ],
    invalid: [
      {
        filename: 'component.vue',
        code: `
          <script setup lang="ts">
          import * as VueUse from '@vueuse/core'
          </script>
        `,
        errors: [{ messageId: 'noNamespace' }],
      },
    ],
  })
})
