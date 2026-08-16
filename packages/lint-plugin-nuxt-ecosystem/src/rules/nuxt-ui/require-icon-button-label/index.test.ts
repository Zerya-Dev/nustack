import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-icon-button-label', () => {
  it('labels icon-, avatar-, and loading-only buttons', () => {
    tester.run('require-icon-button-label', nuxtUiPlugin.rules['require-icon-button-label'], {
      valid: [
        { code: '<template><UButton icon="i-lucide-search" aria-label="Search" /></template>' },
        { code: '<template><UButton icon="i-lucide-save">Save</UButton></template>' },
        { code: '<template><UButton :loading="false" /></template>' },
        { code: '<template><UButton icon="i-lucide-save"><span>Save</span></UButton></template>' },
        { code: '<template><UButton icon="i-lucide-save"><LocalizedText /></UButton></template>' },
        { code: '<template><UButton v-bind="{ loading: false }" /></template>' },
      ],
      invalid: [
        { code: '<template><UButton icon="i-lucide-search" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton :avatar="avatar" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton loading /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton leading-icon="i-lucide-search" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton><UIcon name="i-lucide-search" /></UButton></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton><template #leading><UIcon name="i-lucide-search" /></template></UButton></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton icon="i-lucide-search"><span aria-hidden="true">Search</span></UButton></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton icon="i-lucide-search"><span v-if="false">Search</span></UButton></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton v-bind="{ loading: true }" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UButton icon="i-lucide-search"><Transition /></UButton></template>', errors: [{ messageId: 'missingLabel' }] },
      ],
    })
  })
})
