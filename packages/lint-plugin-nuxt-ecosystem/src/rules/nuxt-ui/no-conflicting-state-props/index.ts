import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasDefiniteAttribute, hasVModel } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

// Verified against @nuxt/ui 4.9; re-verify on the next major.
const OPEN_STATE_COMPONENTS = [
  'Collapsible',
  'ContextMenu',
  'Drawer',
  'DropdownMenu',
  'InputMenu',
  'Modal',
  'NavigationMenu',
  'Popover',
  'SelectMenu',
  'Slideover',
  'Toast',
  'Tooltip',
]

const VALUE_STATE_COMPONENTS = [
  'Accordion',
  'Calendar',
  'Checkbox',
  'CheckboxGroup',
  'ColorPicker',
  'CommandPalette',
  'Input',
  'InputDate',
  'InputMenu',
  'InputNumber',
  'InputTags',
  'InputTime',
  'Listbox',
  'NavigationMenu',
  'PinInput',
  'RadioGroup',
  'Select',
  'SelectMenu',
  'Slider',
  'Stepper',
  'Switch',
  'Tabs',
  'Textarea',
  'Timeline',
  'Tree',
]

export const noConflictingStateProps: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow mixing controlled Nuxt UI state with its uncontrolled default prop.',
      url: docsUrl('nuxt-ui/no-conflicting-state-props'),
    },
    schema: [],
    messages: {
      conflicting: '`<{{ component }}>` cannot use controlled `{{ controlled }}` together with `{{ uncontrolled }}`; choose one state model.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (matcher.isOneOf(node, OPEN_STATE_COMPONENTS)
          && hasDefiniteAttribute(node, 'default-open')
          && (hasDefiniteAttribute(node, 'open') || hasVModel(node, 'open'))) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'conflicting',
            data: { component: matcher.rawName(node), controlled: 'open / v-model:open', uncontrolled: 'default-open' },
          })
        }

        if (matcher.isOneOf(node, VALUE_STATE_COMPONENTS)
          && hasDefiniteAttribute(node, 'default-value')
          && (hasDefiniteAttribute(node, 'model-value') || hasVModel(node, null))) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'conflicting',
            data: { component: matcher.rawName(node), controlled: 'model-value / v-model', uncontrolled: 'default-value' },
          })
        }
      },
    })
  },
}
