import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../../utils/component-matcher.js'
import { isNativeElement } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, documentRoot, getStaticAttribute } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const NATIVE_CONTROLS = new Set(['input', 'select', 'textarea'])

const UI_CONTROLS = new Set([
  'Checkbox',
  'ColorPicker',
  'FileUpload',
  'Input',
  'InputDate',
  'InputNumber',
  'InputTime',
  'RadioGroup',
  'Select',
  'Slider',
  'Switch',
  'Textarea',
])

function isFormControl(node: VueAST.VElement, matcher: ComponentMatcher): boolean {
  return [...NATIVE_CONTROLS].some(tag => isNativeElement(node, tag)) || matcher.isOneOf(node, UI_CONTROLS)
}

function containsFormControl(node: any, matcher: ComponentMatcher): boolean {
  return node.children.some((child: any) =>
    child.type === 'VElement'
    && (isFormControl(child, matcher) || containsFormControl(child, matcher)),
  )
}

function hasControlWithId(node: any, id: string, matcher: ComponentMatcher): boolean {
  if (node.type === 'VElement' && isFormControl(node, matcher) && getStaticAttribute(node, 'id') === id)
    return true
  return node.children?.some((child: any) => hasControlWithId(child, id, matcher)) ?? false
}

export const preferUFormField: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer UFormField over hand-written label and form-control pairs.',
      url: docsUrl('nuxt-ui/prefer-u-form-field'),
    },
    schema: [],
    messages: {
      preferUFormField: 'Use `<UFormField label="...">` for this labelled control.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (!isNativeElement(node, 'label'))
          return

        if (containsFormControl(node, matcher)) {
          context.report({ loc: node.startTag.loc, messageId: 'preferUFormField' })
          return
        }

        const id = getStaticAttribute(node, 'for')
        if (id && hasControlWithId(documentRoot(node), id, matcher))
          context.report({ loc: node.startTag.loc, messageId: 'preferUFormField' })
      },
    })
  },
}
