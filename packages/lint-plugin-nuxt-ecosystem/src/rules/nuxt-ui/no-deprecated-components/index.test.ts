import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['no-deprecated-components']

describe('no-deprecated-components', () => {
  it('reports Nuxt UI components renamed in v4', () => {
    tester.run('no-deprecated-components', rule, {
      valid: [
        { code: '<template><UFieldGroup /></template>' },
        { code: '<template><UMarquee :items="items" /></template>' },
        { code: '<template><UAccordion :items="items" /></template>' },
      ],
      invalid: [
        { code: '<template><u-button-group>x</u-button-group></template>', output: '<template><u-field-group>x</u-field-group></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><LazyUPageMarquee /></template>', output: '<template><LazyUMarquee /></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UButtonGroup /></template>', output: '<template><UFieldGroup /></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UPageMarquee :items="items" /></template>', output: '<template><UMarquee :items="items" /></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UPageAccordion :items="items" /></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UFormGroup label="Email"><UInput /></UFormGroup></template>', output: '<template><UFormField label="Email"><UInput /></UFormField></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UDivider /></template>', output: '<template><USeparator /></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UFoo /></template>', options: [{ components: { UFoo: 'UBar' } }], output: '<template><UBar /></template>', errors: [{ messageId: 'deprecated' }] },
        { code: '<template><UUserCard /></template>', options: [{ components: { UserCard: 'MemberCard' } }], output: '<template><UMemberCard /></template>', errors: [{ messageId: 'deprecated' }] },
      ],
    })
  })
})
