import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasRawOptOut } from '../utils.js'

const ICON_NAME = /^i-[a-z\d]+-[a-z\d][a-z\d-]*$/i

export const noInvalidIconName: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require valid Iconify-style names in static Nuxt UI icon props.',
      url: docsUrl('nuxt-ui/no-invalid-icon-name'),
    },
    schema: [{
      type: 'object',
      properties: {
        /** Extra exact static names accepted for project-specific icon providers. */
        names: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      invalidName: '`{{ name }}` is not a valid Nuxt UI Iconify name; use `i-<collection>-<icon>` or a dynamic Vue component binding.',
    },
  },
  create(context: any) {
    const names = new Set<string>(context.options[0]?.names ?? [])
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (!node.name.startsWith('u') || hasRawOptOut(node))
          return

        for (const attribute of node.startTag.attributes) {
          if (attribute.directive || !attribute.value)
            continue
          const prop = attribute.key.name as string
          if (prop !== 'name' && !prop.endsWith('icon'))
            continue
          // `name` is an icon name only on UIcon; other components use it for form fields.
          if (prop === 'name' && node.name !== 'uicon')
            continue
          const name = attribute.value.value
          if (!ICON_NAME.test(name) && !names.has(name)) {
            context.report({
              loc: attribute.loc ?? node.startTag.loc,
              messageId: 'invalidName',
              data: { name },
            })
          }
        }
      },
    })
  },
}
