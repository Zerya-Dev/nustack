import type { Rule } from '@oxlint/plugins'

const CONTROL_MAP: Record<string, string> = {
  input: 'UInput',
  select: 'USelect',
  textarea: 'UTextarea',
}

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
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
    },
  },
  create(context: any) {
    const services = context.sourceCode.parserServices
    if (typeof services?.defineTemplateBodyVisitor !== 'function')
      return {}

    return services.defineTemplateBodyVisitor({
      VElement(node: any) {
        const replacement = CONTROL_MAP[node.name]
        if (replacement && !hasEscapeHatch(node)) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'preferUFormControl',
            data: { tag: node.name, replacement },
          })
        }
      },
    })
  },
}
