import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttributeValue, hasAttribute, hasLabelContent, hasNonEmptyAttribute } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const ICON_PROPS = ['icon', 'leading-icon', 'trailing-icon', 'avatar']

const DECORATIVE_COMPONENTS = ['Icon', 'Avatar']

function canBeLoading(node: VueAST.VElement): boolean {
  const loading = getAttributeValue(node, 'loading')
  if (!loading.present)
    return false
  return !loading.known || (loading.value !== false && loading.value !== 'false')
}

function hasDecorativeChild(node: VueAST.VElement, matcher: ComponentMatcher): boolean {
  return node.children.some(child => child.type === 'VElement'
    && (matcher.isOneOf(child, DECORATIVE_COMPONENTS) || hasDecorativeChild(child, matcher)))
}

export const requireIconButtonLabel: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible label for icon-, avatar-, and loading-only Nuxt UI buttons.',
      url: docsUrl('nuxt-ui/require-icon-button-label'),
    },
    schema: [],
    messages: {
      missingLabel: 'Icon-, avatar-, or loading-only `<UButton>` needs `label`, `aria-label`, or an accessible `title`.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (!matcher.is(node, 'Button'))
          return

        const iconOnly = ICON_PROPS.some(prop => hasAttribute(node, prop))
          || canBeLoading(node)
          || hasDecorativeChild(node, matcher)
        if (!iconOnly)
          return

        if (hasNonEmptyAttribute(node, 'label') || hasNonEmptyAttribute(node, 'aria-label')
          || hasNonEmptyAttribute(node, 'title')
          || hasLabelContent(node, child => matcher.isOneOf(child, DECORATIVE_COMPONENTS))) {
          return
        }
        context.report({ loc: node.startTag.loc, messageId: 'missingLabel' })
      },
    })
  },
}
