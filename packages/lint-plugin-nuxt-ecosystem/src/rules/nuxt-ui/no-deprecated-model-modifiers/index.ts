import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, normalizePropName } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

/** Verified 2026-07-21 against the ui.nuxt.com v4 migration guide; re-verify on the next major. */
const DEPRECATED_MODIFIERS: Record<string, string> = {
  nullify: 'nullable',
}

const TARGET_COMPONENTS = ['Input', 'InputNumber', 'Textarea']

interface Options {
  modifiers?: Record<string, string>
  components?: string[]
}

function vModel(node: any): any {
  return node.startTag.attributes.find(
    (attribute: any) => attribute.directive && attribute.key.name?.name === 'model',
  ) ?? null
}

function modelModifiersObject(node: any): any | null {
  const attribute = node.startTag.attributes.find((candidate: any) => {
    if (!candidate.directive || candidate.key.name?.name !== 'bind')
      return false
    const argument = candidate.key.argument
    return argument?.type === 'VIdentifier' && normalizePropName(argument.name) === normalizePropName('model-modifiers')
  })
  return attribute?.value?.expression?.type === 'ObjectExpression'
    ? attribute.value.expression
    : null
}

export const noDeprecatedModelModifiers: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the `v-model.nullify` modifier renamed to `.nullable` in Nuxt UI v4.',
      url: docsUrl('nuxt-ui/no-deprecated-model-modifiers'),
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        modifiers: { type: 'object', additionalProperties: { type: 'string' } },
        components: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      preferNullable: 'The `v-model.{{ old }}` modifier was renamed in Nuxt UI v4, use `v-model.{{ replacement }}` instead.',
    },
  },
  create(context: Context): Visitor {
    const options = (context.options[0] ?? {}) as Options
    const modifiers: Record<string, string> = { ...DEPRECATED_MODIFIERS, ...options.modifiers }
    const matcher = createNuxtUiMatcher(context)
    const targets: string[] = options.components ?? TARGET_COMPONENTS

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (!matcher.isOneOf(node, targets))
          return

        const model = vModel(node)
        for (const modifier of model?.key.modifiers ?? []) {
          const replacement = modifiers[modifier.name]
          if (replacement) {
            context.report({
              loc: modifier.loc ?? model.key.loc,
              messageId: 'preferNullable',
              data: { old: modifier.name, replacement },
              fix: (fixer: any) => fixer.replaceTextRange(modifier.range, replacement),
            })
          }
        }

        for (const property of modelModifiersObject(node)?.properties ?? []) {
          if (property.type !== 'Property' || property.computed)
            continue
          const name = property.key.name ?? property.key.value
          const replacement = modifiers[name]
          if (replacement) {
            context.report({
              loc: property.key.loc ?? property.loc,
              messageId: 'preferNullable',
              data: { old: name, replacement },
              fix: (fixer: any) => fixer.replaceTextRange(
                property.key.range,
                property.shorthand
                  ? `${replacement}: ${name}`
                  : property.key.type === 'Literal' ? `'${replacement}'` : replacement,
              ),
            })
          }
        }
      },
    })
  },
}
