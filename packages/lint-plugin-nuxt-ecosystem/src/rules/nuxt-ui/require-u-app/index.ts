import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor } from '../utils.js'

function isNuxtAppFile(filename: string): boolean {
  const normalized = filename.replaceAll('\\', '/').toLowerCase()
  return (normalized === 'app.vue' || normalized.endsWith('/app.vue'))
    && !normalized.includes('/components/')
    && !normalized.includes('/pages/')
    && !normalized.includes('/layouts/')
}

function containsUApp(node: any): boolean {
  if (node.name === 'uapp')
    return true
  return (node.children ?? []).some((child: any) => child.type === 'VElement' && containsUApp(child))
}

export const requireUApp: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require the Nuxt UI App provider in the Nuxt application root.',
      url: docsUrl('nuxt-ui/require-u-app'),
    },
    schema: [],
    messages: {
      missingApp: 'Wrap the application in `<UApp>` to provide Nuxt UI configuration, toasts, tooltips, and programmatic overlays.',
    },
  },
  create(context: any) {
    const filename = context.filename ?? context.getFilename()
    if (!isNuxtAppFile(filename))
      return {}

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.parent?.type === 'VDocumentFragment' && !containsUApp(node))
          context.report({ loc: node.startTag.loc, messageId: 'missingApp' })
      },
    })
  },
}
