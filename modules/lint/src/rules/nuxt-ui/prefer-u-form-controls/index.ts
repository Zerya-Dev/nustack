import type { Rule } from 'eslint'
import { createRule } from '../../utils'

/** Raw form control → Nuxt UI replacement. */
const CONTROL_MAP: Record<string, string> = {
  input: 'UInput',
  select: 'USelect',
  textarea: 'UTextarea',
}

function hasEscapeHatch(node: any): boolean {
  return node.startTag.attributes.some(
    (a: any) => !a.directive && a.key.name === 'data-raw',
  )
}

/**
 * When `@nuxt/ui` is present, prefer its form controls (`<UInput>`, `<USelect>`,
 * `<UTextarea>`) over raw `<input>` / `<select>` / `<textarea>`. Opt out with
 * `data-raw`.
 */
export const rule: Rule.RuleModule = createRule<'preferUFormControl', []>({
  name: 'nuxt-ui/prefer-u-form-controls',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI form controls over raw form elements',
    },
    schema: [],
    messages: {
      preferUFormControl: 'NuStack standardizes on Nuxt UI form controls for consistent styling and a11y. Use `<{{ replacement }}>` instead of a raw `<{{ tag }}>` (add `data-raw` to opt out).',
    },
  },
  defaultOptions: [],
  create(context) {
    const services = (context.sourceCode as any).parserServices
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
})
