import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentName, defineTemplateVisitor } from '../utils.js'

const COLORS = ['error', 'primary', 'secondary', 'success', 'info', 'warning', 'neutral']
const SIZES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

/** Verified 2026-07-21 against the component API tables on ui.nuxt.com. */
const VALUES: Record<string, Record<string, string[]>> = {
  ubutton: { color: COLORS, variant: ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  ubadge: { color: COLORS, variant: ['solid', 'outline', 'soft', 'subtle'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  ualert: { color: COLORS, variant: ['solid', 'outline', 'soft', 'subtle'] },
  ucard: { variant: ['solid', 'outline', 'soft', 'subtle'] },
  ucheckbox: { color: COLORS, variant: ['list', 'card'], size: ['xs', 'sm', 'md', 'lg', 'xl'], indicator: ['start', 'end', 'hidden'] },
  ucheckboxgroup: { color: COLORS, variant: ['list', 'card', 'table'], size: ['xs', 'sm', 'md', 'lg', 'xl'], orientation: ['horizontal', 'vertical'], indicator: ['start', 'end', 'hidden'] },
  ufileupload: { color: COLORS, variant: ['button', 'area'], size: ['xs', 'sm', 'md', 'lg', 'xl'], layout: ['list', 'grid'], position: ['inside', 'outside'] },
  uinput: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uinputdate: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uinputmenu: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uinputnumber: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uinputtags: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uinputtime: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  utextarea: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  upininput: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uradiogroup: { color: COLORS, variant: ['list', 'card', 'table'], size: ['xs', 'sm', 'md', 'lg', 'xl'], orientation: ['horizontal', 'vertical'], indicator: ['start', 'end', 'hidden'] },
  uselect: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uselectmenu: { color: COLORS, variant: ['outline', 'soft', 'subtle', 'ghost', 'none'], size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uslider: { color: COLORS, size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uswitch: { color: COLORS, size: ['xs', 'sm', 'md', 'lg', 'xl'] },
  uavatar: { size: SIZES },
}

export const noInvalidPropValues: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow statically invalid Nuxt UI component color, variant, and size values.',
      url: docsUrl('nuxt-ui/no-invalid-prop-values'),
    },
    schema: [{
      type: 'object',
      properties: {
        /** Extra static values keyed by component and prop, merged onto the documented v4 values. */
        values: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      additionalProperties: false,
    }],
    messages: {
      invalid: '`{{ value }}` is not a valid `{{ prop }}` for `<{{ component }}>`; use one of: {{ allowed }}.',
    },
  },
  create(context: any) {
    const values: Record<string, Record<string, string[]>> = {}
    for (const [component, props] of Object.entries(VALUES))
      values[component] = Object.fromEntries(Object.entries(props).map(([prop, allowed]) => [prop, [...allowed]]))

    for (const [component, props] of Object.entries(context.options[0]?.values ?? {}) as [string, Record<string, string[]>][]) {
      const key = component.toLowerCase()
      const componentValues = values[key] ?? (values[key] = {})
      for (const [prop, allowed] of Object.entries(props))
        componentValues[prop] = [...(componentValues[prop] ?? []), ...allowed]
    }

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        const props = values[node.name]
        if (!props)
          return
        for (const attribute of node.startTag.attributes) {
          if (attribute.directive || !attribute.value)
            continue
          const prop = attribute.key.name as string
          const allowed = props[prop]
          if (!allowed)
            continue
          if (!allowed.includes(attribute.value.value)) {
            context.report({
              loc: attribute.loc ?? node.startTag.loc,
              messageId: 'invalid',
              data: {
                value: attribute.value.value,
                prop,
                component: componentName(node.name),
                allowed: allowed.join(', '),
              },
            })
          }
        }
      },
    })
  },
}
