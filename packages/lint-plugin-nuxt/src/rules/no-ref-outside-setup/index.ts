import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { isFunctionNode } from '../../utils/ast.js'
import { createComponentSetupMatcher } from '../../utils/component-setup.js'
import { docsUrl } from '../../utils/docs-url.js'
import { createImportedCallMatcher } from '../../utils/imports.js'

const REF_IMPORT_SOURCES = new Set(['vue'])
const REF_NAMES = new Set(['ref'])

export const noRefOutsideSetup: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Vue refs outside `<script setup>` or a `setup()` function.',
      url: docsUrl('no-ref-outside-setup'),
    },
    schema: [],
    messages: {
      outsideSetup: '`ref()` outside `<script setup>` or `setup()` can create state shared across server requests. Use an SSR-safe `useState()` composable instead.',
    },
  },
  create(context: Context): Visitor {
    const sourceCode = context.sourceCode
    const componentSetup = createComponentSetupMatcher(sourceCode)
    const { collectImports, importedCallName } = createImportedCallMatcher(sourceCode, {
      importSources: REF_IMPORT_SOURCES,
      names: REF_NAMES,
      includeTypeImports: true,
    })

    function isInsideSetupFunction(node: ESTree.CallExpression): boolean {
      for (let ancestor: ESTree.Node | null = node.parent; ancestor; ancestor = ancestor.parent) {
        if (isFunctionNode(ancestor) && componentSetup.isSetupFunction(ancestor))
          return true
      }
      return false
    }

    return {
      Program(node: ESTree.Program): void {
        collectImports(node)
        componentSetup.collectImports(node)
      },
      CallExpression(node: ESTree.CallExpression): void {
        if (importedCallName(node) !== 'ref')
          return
        if (componentSetup.isInScriptSetup(node) || isInsideSetupFunction(node))
          return

        context.report({ node: node.callee, messageId: 'outsideSetup' })
      },
    }
  },
}
