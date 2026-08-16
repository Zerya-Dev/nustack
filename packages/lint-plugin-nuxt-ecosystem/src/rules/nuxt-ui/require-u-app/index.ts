import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../../utils/component-matcher.js'
import { isAbsolute, relative } from 'node:path'
import { normalizeComponentKey } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

const AUXILIARY_COMPONENTS = new Set(['nuxtloadingindicator', 'nuxtrouteannouncer'])

function isNuxtAppFile(filename: string, cwd: string): boolean {
  const projectPath = isAbsolute(filename) ? relative(cwd, filename) : filename
  const normalized = projectPath.replaceAll('\\', '/')
  return normalized === 'app.vue' || normalized === 'app/app.vue'
}

function descendants(node: VueAST.VElement): VueAST.VElement[] {
  const result: VueAST.VElement[] = []
  for (const child of node.children) {
    if (child.type !== 'VElement')
      continue
    result.push(child, ...descendants(child))
  }
  return result
}

function hasUAppAncestor(node: VueAST.VElement, root: VueAST.VElement, matcher: ComponentMatcher): boolean {
  let parent: VueAST.Node | null | undefined = node.parent
  while (parent && parent !== root) {
    if (parent.type === 'VElement' && matcher.is(parent, 'App'))
      return true
    parent = 'parent' in parent ? parent.parent : null
  }
  return false
}

function isDescendant(node: VueAST.VElement, ancestor: VueAST.VElement): boolean {
  let parent: VueAST.Node | null | undefined = node.parent
  while (parent) {
    if (parent === ancestor)
      return true
    parent = 'parent' in parent ? parent.parent : null
  }
  return false
}

function wrapsApplication(root: VueAST.VElement, matcher: ComponentMatcher): boolean {
  const elements = descendants(root)
  const entries = elements.filter((element) => {
    const name = normalizeComponentKey(matcher.rawName(element))
    return name === 'nuxtpage' || name === 'nuxtlayout'
  })

  if (entries.length > 0)
    return entries.every(entry => hasUAppAncestor(entry, root, matcher))

  return elements.filter(element => matcher.is(element, 'App')).some(app => elements.every((element) => {
    const name = normalizeComponentKey(matcher.rawName(element))
    return element === app
      || isDescendant(element, app)
      || isDescendant(app, element)
      || AUXILIARY_COMPONENTS.has(name)
  }))
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
  create(context: Context): Visitor {
    if (!isNuxtAppFile(context.filename, context.cwd))
      return {}

    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (node.parent?.type === 'VDocumentFragment' && !wrapsApplication(node, matcher))
          context.report({ loc: node.startTag.loc, messageId: 'missingApp' })
      },
    })
  },
}
