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
import { docsUrl } from '../../utils/docs-url.js'
import { createImportedCallMatcher } from '../../utils/imports.js'
import { findVariable, functionBindingReferences } from '../../utils/scope.js'
import { isInRanges, scriptSetupRanges } from '../../utils/vue.js'

const ASYNC_DATA_COMPOSABLES = new Set([
  'useAsyncData',
  'useFetch',
  'useLazyAsyncData',
  'useLazyFetch',
])

const NUXT_IMPORT_SOURCES = new Set(['#app', '#imports', 'nuxt/app'])
const NUXT_INITIALIZER_FACTORIES = new Set([
  'defineNuxtPlugin',
  'defineNuxtRouteMiddleware',
])

function isCallbackArgument(node: ESTree.Node): boolean {
  const { expression, parent } = transparentExpressionContext(node)
  if (parent?.type !== 'CallExpression' || !parent.arguments.includes(expression as ESTree.Argument))
    return false

  const callee = unwrapExpression(parent.callee)
  return !(parent.arguments[0] === expression
    && callee.type === 'Identifier'
    && NUXT_INITIALIZER_FACTORIES.has(callee.name))
}

function isNuxtInitializerCallback(node: FunctionNode): boolean {
  const { expression, parent } = transparentExpressionContext(node)

  if (parent?.type !== 'CallExpression' || parent.arguments[0] !== expression)
    return false

  const callee = unwrapExpression(parent.callee)
  return callee.type === 'Identifier' && NUXT_INITIALIZER_FACTORIES.has(callee.name)
}

function isDeferredReference(
  sourceCode: Context['sourceCode'],
  reference: ESTree.Node,
  seen: Set<ESTree.Node>,
): boolean {
  if (isCallbackArgument(reference))
    return true

  const { expression, parent } = transparentExpressionContext(reference)
  if (parent?.type === 'CallExpression' && parent.callee === expression) {
    for (let ancestor: ESTree.Node | null = parent.parent; ancestor; ancestor = ancestor.parent) {
      if (isFunctionNode(ancestor))
        return !isInitialExecutionFunction(sourceCode, ancestor, seen)
    }
    return false
  }

  if (parent?.type === 'VariableDeclarator' && parent.init === expression && parent.id.type === 'Identifier') {
    const alias = parent.id as NamedIdentifier
    if (seen.has(alias))
      return false
    seen.add(alias)
    const variable = findVariable(sourceCode, alias, alias.name)
    return variable?.references.some(reference =>
      isDeferredReference(sourceCode, reference.identifier as NamedIdentifier, seen)) ?? false
  }

  if (parent?.type === 'Property' && parent.value === expression) {
    return objectPropertyReferences(sourceCode, parent as ESTree.ObjectProperty)
      ?.some(member => isDeferredReference(sourceCode, member, seen)) ?? false
  }

  return false
}

function objectPropertyReferences(sourceCode: Context['sourceCode'], property: ESTree.ObjectProperty): ESTree.Node[] | undefined {
  if (property.parent?.type !== 'ObjectExpression')
    return
  const propertyName = staticPropertyName(property, true)
  if (!propertyName)
    return

  const objectContext = transparentExpressionContext(property.parent)
  if (objectContext.parent?.type !== 'VariableDeclarator'
    || objectContext.parent.init !== objectContext.expression
    || objectContext.parent.id.type !== 'Identifier') {
    return
  }
  const objectIdentifier = objectContext.parent.id as NamedIdentifier
  return objectMemberReferences(sourceCode, objectIdentifier, propertyName, new Set([objectIdentifier]))
}

function objectMemberReferences(
  sourceCode: Context['sourceCode'],
  objectIdentifier: NamedIdentifier,
  propertyName: string,
  seen: Set<NamedIdentifier>,
): ESTree.Node[] | undefined {
  const variable = findVariable(sourceCode, objectIdentifier, objectIdentifier.name)
  return variable?.references.flatMap((reference) => {
    const identifier = reference.identifier as NamedIdentifier
    const { expression, parent } = transparentExpressionContext(identifier)
    if (parent?.type === 'MemberExpression' && parent.object === expression && staticPropertyName(parent) === propertyName)
      return [parent]

    if (parent?.type === 'VariableDeclarator' && parent.init === expression) {
      if (parent.id.type === 'Identifier') {
        const alias = parent.id as NamedIdentifier
        if (seen.has(alias))
          return []
        seen.add(alias)
        return objectMemberReferences(sourceCode, alias, propertyName, seen) ?? []
      }
      if (parent.id.type === 'ObjectPattern') {
        const binding = parent.id.properties.find(property =>
          property.type === 'Property' && staticPropertyName(property as ESTree.ObjectProperty, true) === propertyName)
        if (binding?.type === 'Property' && binding.value.type === 'Identifier') {
          const variable = findVariable(sourceCode, binding.value, binding.value.name)
          return variable?.references.map(item => item.identifier) ?? []
        }
        if (binding?.type === 'Property' && binding.value.type === 'AssignmentPattern'
          && binding.value.left.type === 'Identifier') {
          const variable = findVariable(sourceCode, binding.value.left, binding.value.left.name)
          return variable?.references.map(item => item.identifier) ?? []
        }
      }
    }

    return []
  })
}

function functionReferences(sourceCode: Context['sourceCode'], node: FunctionNode): ESTree.Node[] | undefined {
  const references = functionBindingReferences(sourceCode, node)
  if (references)
    return references

  const { expression, parent } = transparentExpressionContext(node)
  if (parent?.type !== 'Property' || parent.value !== expression || parent.parent?.type !== 'ObjectExpression')
    return
  return objectPropertyReferences(sourceCode, parent as ESTree.ObjectProperty)
}

function isInitialExecutionFunction(
  sourceCode: Context['sourceCode'],
  node: FunctionNode,
  seen: Set<ESTree.Node> = new Set(),
): boolean {
  const name = functionName(node)
  if (isNuxtInitializerCallback(node))
    return true
  if (name !== 'setup' && !/^use[A-Z0-9]/.test(name ?? ''))
    return false

  const identifier = functionBindingIdentifier(node)
  const cycleKey = identifier ?? node
  if (seen.has(cycleKey))
    return true
  seen.add(cycleKey)
  const references = functionReferences(sourceCode, node)
  return !(references?.some(reference => isDeferredReference(sourceCode, reference, seen)) ?? false)
}

export const noAsyncDataAfterMount: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Nuxt data composables in callbacks that can run after component setup.',
      url: docsUrl('no-async-data-after-mount'),
    },
    schema: [],
    messages: {
      afterMount: '`{{ name }}()` can run after the component has mounted and cannot be awaited during setup. Move it to setup or use `$fetch()` for requests triggered later.',
    },
  },
  create(context: Context): Visitor {
    const sourceCode = context.sourceCode
    const setupRanges = scriptSetupRanges(sourceCode.parserServices)
    const { collectImports, importedCallName } = createImportedCallMatcher(sourceCode, {
      importSources: NUXT_IMPORT_SOURCES,
      names: ASYNC_DATA_COMPOSABLES,
    })

    function isInitialExecutionContext(node: ESTree.CallExpression): boolean {
      for (let ancestor: ESTree.Node | null = node.parent; ancestor; ancestor = ancestor.parent) {
        if (isFunctionNode(ancestor))
          return isInitialExecutionFunction(sourceCode, ancestor)
      }
      return isInRanges(node, setupRanges)
    }

    return {
      Program: collectImports,
      CallExpression(node: ESTree.CallExpression): void {
        const name = importedCallName(node)
        if (!name || isInitialExecutionContext(node))
          return

        context.report({
          node: node.callee,
          messageId: 'afterMount',
          data: { name },
        })
      },
    }
  },
}
