import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import type { FunctionNode, NamedIdentifier } from '../../utils/ast.js'
import {
  functionBindingIdentifier,
  functionName,
  isFunctionNode,
  staticPropertyName,
  transparentExpressionContext,
  unwrapExpression,
} from '../../utils/ast.js'
import { createComponentSetupMatcher } from '../../utils/component-setup.js'
import { docsUrl } from '../../utils/docs-url.js'
import { createImportedCallMatcher } from '../../utils/imports.js'
import { findVariable, functionBindingReferences } from '../../utils/scope.js'

interface Options {
  allow?: string[]
}

const FETCH_NAMES = new Set(['$fetch'])
const NUXT_IMPORT_SOURCES = new Set(['#app', '#imports', 'nuxt/app'])
const WATCH_IMPORT_SOURCES = new Set(['vue', '#imports'])
const WATCH_NAMES = new Set(['watch'])

function hasImmediateTrue(call: ESTree.CallExpression): boolean {
  const options = call.arguments[2]
  if (!options || options.type === 'SpreadElement')
    return false
  const expression = unwrapExpression(options)
  if (expression.type !== 'ObjectExpression')
    return false

  return expression.properties.some((property) => {
    if (property.type !== 'Property'
      || staticPropertyName(property as ESTree.ObjectProperty) !== 'immediate') {
      return false
    }
    const value = unwrapExpression(property.value as ESTree.Expression)
    return value.type === 'Literal' && value.value === true
  })
}

export const noFetchDuringSetup: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `$fetch` for data loaded during initial component setup.',
      url: docsUrl('no-fetch-during-setup'),
    },
    schema: [{
      type: 'object',
      properties: {
        allow: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
        },
      },
      additionalProperties: false,
    }],
    messages: {
      initialFetch: '`$fetch()` used for initial component data can run during SSR and again during hydration without Nuxt payload transfer. Use `useFetch()` or `useAsyncData()` instead, with `lazy: true` for non-blocking data or `server: false` for intentional client-only loading.',
    },
  },
  create(context: Context): Visitor {
    const sourceCode = context.sourceCode
    const allowedLoaders = new Set(((context.options?.[0] ?? {}) as Options).allow ?? [])
    const componentSetup = createComponentSetupMatcher(sourceCode)
    const { collectImports: collectFetchImports, importedCallName: fetchCallName } = createImportedCallMatcher(sourceCode, {
      importSources: NUXT_IMPORT_SOURCES,
      names: FETCH_NAMES,
    })
    const { collectImports: collectWatchImports, importedCallName: watchCallName } = createImportedCallMatcher(sourceCode, {
      importSources: WATCH_IMPORT_SOURCES,
      names: WATCH_NAMES,
    })

    function nearestFunction(node: ESTree.Node): FunctionNode | undefined {
      for (let ancestor: ESTree.Node | null = node.parent; ancestor; ancestor = ancestor.parent) {
        if (isFunctionNode(ancestor))
          return ancestor
      }
    }

    function isDirectSetupPath(node: ESTree.Node): boolean {
      const enclosingFunction = nearestFunction(node)
      return enclosingFunction
        ? componentSetup.isSetupFunction(enclosingFunction)
        : componentSetup.isInScriptSetup(node)
    }

    function isImmediateWatch(call: ESTree.CallExpression): boolean {
      return watchCallName(call) === 'watch' && hasImmediateTrue(call) && isDirectSetupPath(call)
    }

    function isInitialReference(reference: ESTree.Node, seen: Set<ESTree.Node>): boolean {
      const { expression, parent } = transparentExpressionContext(reference)
      if (parent?.type === 'CallExpression') {
        if (parent.arguments[1] === expression && isImmediateWatch(parent))
          return true
        if (parent.callee === expression) {
          const enclosingFunction = nearestFunction(parent)
          return enclosingFunction
            ? isInitialFunction(enclosingFunction, seen)
            : componentSetup.isInScriptSetup(parent)
        }
      }

      if (parent?.type !== 'VariableDeclarator' || parent.init !== expression || parent.id.type !== 'Identifier')
        return false
      const alias = parent.id as NamedIdentifier
      if (seen.has(alias))
        return false
      seen.add(alias)
      return findVariable(sourceCode, alias, alias.name)?.references.some(item =>
        isInitialReference(item.identifier as NamedIdentifier, seen)) ?? false
    }

    function isInitialFunction(node: FunctionNode, seen: Set<ESTree.Node> = new Set()): boolean {
      if (componentSetup.isSetupFunction(node))
        return true

      const { expression, parent } = transparentExpressionContext(node)
      if (parent?.type === 'CallExpression' && parent.arguments[1] === expression && isImmediateWatch(parent))
        return true

      const cycleKey = functionBindingIdentifier(node) ?? node
      if (seen.has(cycleKey))
        return false
      seen.add(cycleKey)
      return functionBindingReferences(sourceCode, node)?.some(reference => isInitialReference(reference, seen)) ?? false
    }

    function isAllowed(node: ESTree.CallExpression): boolean {
      for (let ancestor: ESTree.Node | null = node.parent; ancestor; ancestor = ancestor.parent) {
        if (isFunctionNode(ancestor) && allowedLoaders.has(functionName(ancestor) ?? ''))
          return true
      }
      return false
    }

    function isInitialFetch(node: ESTree.CallExpression): boolean {
      const enclosingFunction = nearestFunction(node)
      return enclosingFunction
        ? isInitialFunction(enclosingFunction)
        : componentSetup.isInScriptSetup(node)
    }

    return {
      Program(node: ESTree.Program): void {
        componentSetup.collectImports(node)
        collectFetchImports(node)
        collectWatchImports(node)
      },
      CallExpression(node: ESTree.CallExpression): void {
        if (fetchCallName(node) !== '$fetch' || isAllowed(node) || !isInitialFetch(node))
          return
        context.report({ node: node.callee, messageId: 'initialFetch' })
      },
    }
  },
}
