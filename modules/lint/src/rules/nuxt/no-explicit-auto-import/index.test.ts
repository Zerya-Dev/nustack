import { describe, ts } from '../../rule-tester'
import { rule as noExplicitAutoImport } from './index'

describe('nuxt/no-explicit-auto-import', () => {
  ts.run('nuxt/no-explicit-auto-import', noExplicitAutoImport, {
    valid: [
      // identifier not in the auto-import list
      { code: `import { foo } from 'vue'`, options: [{ imports: ['ref'] }] },
      // type-only imports are never runtime auto-imports
      { code: `import type { Ref } from 'vue'`, options: [{ imports: ['Ref'] }] },
      { code: `import { type Ref, foo } from 'vue'`, options: [{ imports: ['Ref'] }] },
      // unrelated source
      { code: `import { ref } from 'pinia'`, options: [{ imports: ['ref'] }] },
    ],
    invalid: [
      {
        code: `import { ref } from 'vue'\nconst a = ref(0)\n`,
        options: [{ imports: ['ref', 'computed'] }],
        output: `\nconst a = ref(0)\n`,
        errors: [{ messageId: 'noExplicitAutoImport' }],
      },
      {
        // mixed import → only the auto-imported specifier is stripped
        code: `import { ref, useFoo } from 'vue'\n`,
        options: [{ imports: ['ref'] }],
        output: `import {  useFoo } from 'vue'\n`,
        errors: [{ messageId: 'noExplicitAutoImport' }],
      },
      {
        // component default import from a components/ path
        code: `import MyComp from '~/components/MyComp.vue'\n`,
        options: [{ components: ['MyComp'] }],
        output: `\n`,
        errors: [{ messageId: 'noExplicitAutoImport' }],
      },
    ],
  })
})
