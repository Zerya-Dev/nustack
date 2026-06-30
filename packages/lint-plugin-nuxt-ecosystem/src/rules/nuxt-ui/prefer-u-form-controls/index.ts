import type { Rule } from '@oxlint/plugins'

const CONTROL_MAP: Record<string, string> = {
  input: 'UInput',
  select: 'USelect',
  textarea: 'UTextarea',
}

/**
 * Input `type` values that Nuxt UI v4 ships a dedicated component for. A raw
 * `<input type="number">` (or a generic `<UInput type="number">`) is better served
 * by the specialized control. Verified 2026-06-30 against ui.nuxt.com/docs/components.
 */
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

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
}

/** The statically-known `type="..."` value, or `null` for dynamic (`:type`) / absent types. */
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
    },
    schema: [],
    messages: {
      preferUFormControl: 'NuStack standardizes on Nuxt UI form controls for consistent styling and a11y. Use `<{{ replacement }}>` instead of a raw `<{{ tag }}>` (add `data-raw` to opt out).',
      preferSpecificControl: 'Nuxt UI ships a dedicated component for this input type. Use `<{{ replacement }}>` instead of `<UInput type="{{ type }}">` (add `data-raw` to opt out).',
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        if (hasEscapeHatch(node))
          return

        const type = staticType(node)

        // `<UInput type="number">` — already Nuxt UI, but a dedicated component fits better.
        // (vue-eslint-parser lowercases element names, so `UInput` is `uinput` here.)
        if (node.name === 'uinput') {
          const replacement = type ? TYPE_MAP[type] : null
          if (replacement) {
            context.report({
              loc: node.startTag.loc,
              messageId: 'preferSpecificControl',
              data: { type, replacement },
            })
          }
          return
        }

        // Raw native form elements.
        const base = CONTROL_MAP[node.name]
        if (!base)
          return

        // A raw `<input type="number">` is best replaced by the specialized component.
        const replacement = node.name === 'input' && type && TYPE_MAP[type]
          ? TYPE_MAP[type]
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
