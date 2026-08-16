import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { isNativeHtmlElement } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const CONTROL_MAP: Record<string, string> = {
  input: 'Input',
  select: 'Select',
  textarea: 'Textarea',
}

/** Verified 2026-06-30 against ui.nuxt.com/docs/components; re-verify on the next Nuxt UI major. */
const TYPE_MAP: Record<string, string> = {
  number: 'InputNumber',
  file: 'FileUpload',
  color: 'ColorPicker',
  date: 'InputDate',
  time: 'InputTime',
  range: 'Slider',
  checkbox: 'Checkbox',
  radio: 'RadioGroup',
  submit: 'Button',
  reset: 'Button',
  button: 'Button',
  image: 'Button',
}

/** `type="hidden"` carries data rather than input, so no Nuxt UI control replaces it. */
const IGNORED_TYPE = 'hidden'

function staticType(node: VueAST.VElement): string | null {
  return getStaticAttribute(node, 'type')?.toLowerCase() ?? null
}

interface Options {
  controls?: Record<string, string>
  types?: Record<string, string>
}

export const preferUFormControls: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI form controls over raw form elements.',
      url: docsUrl('nuxt-ui/prefer-u-form-controls'),
    },
    schema: [{
      type: 'object',
      properties: {
        controls: { type: 'object', additionalProperties: { type: 'string' } },
        types: { type: 'object', additionalProperties: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      preferUFormControl: 'Use `<{{ replacement }}>` instead of `<{{ tag }}>`.',
      preferSpecificControl: 'Use `<{{ replacement }}>` instead of `<{{ component }} type="{{ type }}">`.',
    },
  },
  create(context: Context): Visitor {
    const options = (context.options[0] ?? {}) as Options
    const controlMap: Record<string, string> = { ...CONTROL_MAP, ...options.controls }
    const typeMap: Record<string, string> = { ...TYPE_MAP, ...options.types }
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const type = staticType(node)
        if (type === IGNORED_TYPE)
          return

        if (matcher.is(node, 'Input')) {
          const replacement = type === null ? undefined : typeMap[type]
          if (type !== null && replacement) {
            context.report({
              loc: node.startTag.loc,
              messageId: 'preferSpecificControl',
              data: {
                type,
                replacement: matcher.prefixed(replacement),
                component: matcher.prefixed('Input'),
              },
            })
          }
          return
        }

        if (!isNativeHtmlElement(node))
          return

        const base = controlMap[node.name]
        if (!base)
          return

        const replacement = node.name === 'input' && type && typeMap[type]
          ? typeMap[type]
          : base

        context.report({
          loc: node.startTag.loc,
          messageId: 'preferUFormControl',
          data: { tag: node.name, replacement: matcher.prefixed(replacement) },
        })
      },
    })
  },
}
