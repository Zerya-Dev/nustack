import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasRawOptOut } from '../utils.js'

const CONTROL_MAP: Record<string, string> = {
  input: 'UInput',
  select: 'USelect',
  textarea: 'UTextarea',
}

/** Verified 2026-06-30 against ui.nuxt.com/docs/components; re-verify on the next Nuxt UI major. */
const TYPE_MAP: Record<string, string> = {
  number: 'UInputNumber',
  file: 'UFileUpload',
  color: 'UColorPicker',
  date: 'UInputDate',
  time: 'UInputTime',
  range: 'USlider',
  checkbox: 'UCheckbox',
  radio: 'URadioGroup',
}

/** The static `type="..."` value; `null` for dynamic (`:type`) or absent types. */
function staticType(node: any): string | null {
  const attribute = node.startTag.attributes.find(
    (attribute: any) => !attribute.directive && attribute.key.name === 'type' && attribute.value,
  )
  return attribute ? attribute.value.value : null
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
        /** Extra `tag` → `Component` mappings, merged onto the built-in native-element map. */
        controls: { type: 'object', additionalProperties: { type: 'string' } },
        /** Extra input-`type` → `Component` mappings, merged onto the built-in type map. */
        types: { type: 'object', additionalProperties: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      preferUFormControl: 'Use `<{{ replacement }}>` instead of `<{{ tag }}>`; add `data-raw` to allow the native element.',
      preferSpecificControl: 'Use `<{{ replacement }}>` instead of `<UInput type="{{ type }}">`; add `data-raw` to allow the native element.',
    },
  },
  create(context: any) {
    const options = context.options[0] ?? {}
    const controlMap: Record<string, string> = { ...CONTROL_MAP, ...options.controls }
    const typeMap: Record<string, string> = { ...TYPE_MAP, ...options.types }

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (hasRawOptOut(node))
          return

        const type = staticType(node)

        // `<UInput type="number">`, already Nuxt UI, but a dedicated component fits better.
        if (node.name === 'uinput') {
          const replacement = type ? typeMap[type] : null
          if (replacement) {
            context.report({
              loc: node.startTag.loc,
              messageId: 'preferSpecificControl',
              data: { type, replacement },
            })
          }
          return
        }

        const base = controlMap[node.name]
        if (!base)
          return

        const replacement = node.name === 'input' && type && typeMap[type]
          ? typeMap[type]
          : base

        context.report({
          loc: node.startTag.loc,
          messageId: 'preferUFormControl',
          data: { tag: node.name, replacement },
        })
      },
    })
  },
}
