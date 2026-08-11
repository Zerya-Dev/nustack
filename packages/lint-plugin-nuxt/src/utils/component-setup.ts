import type { Context, ESTree } from '@oxlint/plugins'
import type { FunctionNode, NamedIdentifier } from './ast.js'
import {
  functionBindingIdentifier,
  staticPropertyName,
  transparentExpressionContext,
} from './ast.js'
import { createImportedCallMatcher } from './imports.js'
import { findVariable } from './scope.js'
import { isInRanges, scriptSetupRanges } from './vue.js'

const COMPONENT_FACTORIES = new Set(['defineComponent', 'defineNuxtComponent'])
const COMPONENT_IMPORT_SOURCES = new Set(['vue', '#app', '#imports', 'nuxt/app'])
type ComponentFactoryName = (call: ESTree.CallExpression) => string | undefined

function isComponentFactoryCall(node: ESTree.Node | null, argument: ESTree.Node, factoryName: ComponentFactoryName): boolean {
  return node?.type === 'CallExpression'
    && node.arguments[0] === argument
    && factoryName(node) !== undefined
}

function isComponentObjectReference(
  sourceCode: Context['sourceCode'],
  identifier: NamedIdentifier,
  factoryName: ComponentFactoryName,
  seen: Set<NamedIdentifier>,
): boolean {
  const { expression, parent } = transparentExpressionContext(identifier)
  if (isComponentFactoryCall(parent, expression, factoryName))
    return true
  if (parent?.type === 'ExportDefaultDeclaration')
    return true
  if (parent?.type === 'ExportSpecifier' && parent.local === expression)
    return true
  if (parent?.type !== 'VariableDeclarator' || parent.init !== expression || parent.id.type !== 'Identifier')
    return false

  const alias = parent.id as NamedIdentifier
  if (seen.has(alias))
    return false
  seen.add(alias)
  const variable = findVariable(sourceCode, alias, alias.name)
  return variable?.references.some(reference =>
    isComponentObjectReference(sourceCode, reference.identifier as NamedIdentifier, factoryName, seen)) ?? false
}

function isExportedComponentObject(
  sourceCode: Context['sourceCode'],
  node: ESTree.ObjectExpression,
  factoryName: ComponentFactoryName,
): boolean {
  const { expression, parent } = transparentExpressionContext(node)
  if (isComponentFactoryCall(parent, expression, factoryName))
    return true
  if (parent?.type === 'ExportDefaultDeclaration')
    return true
  if (parent?.type !== 'VariableDeclarator' || parent.init !== expression || parent.id.type !== 'Identifier')
    return false
  if (parent.parent?.type === 'VariableDeclaration' && parent.parent.parent?.type === 'ExportNamedDeclaration')
    return true

  const variable = findVariable(sourceCode, parent.id, parent.id.name)
  const seen = new Set([parent.id as NamedIdentifier])
  return variable?.references.some(reference =>
    isComponentObjectReference(sourceCode, reference.identifier as NamedIdentifier, factoryName, seen)) ?? false
}

function isComponentSetupProperty(
  sourceCode: Context['sourceCode'],
  parent: ESTree.Node | null,
  expression: ESTree.Node,
  factoryName: ComponentFactoryName,
): boolean {
  return parent?.type === 'Property'
    && parent.value === expression
    && staticPropertyName(parent as ESTree.ObjectProperty, true) === 'setup'
    && parent.parent?.type === 'ObjectExpression'
    && isExportedComponentObject(sourceCode, parent.parent, factoryName)
}

function isComponentSetupReference(
  sourceCode: Context['sourceCode'],
  identifier: NamedIdentifier,
  factoryName: ComponentFactoryName,
  seen: Set<NamedIdentifier>,
): boolean {
  const { expression, parent } = transparentExpressionContext(identifier)
  if (isComponentFactoryCall(parent, expression, factoryName))
    return true
  if (parent?.type === 'VariableDeclarator' && parent.init === expression && parent.id.type === 'Identifier') {
    const alias = parent.id as NamedIdentifier
    if (seen.has(alias))
      return false
    seen.add(alias)
    const variable = findVariable(sourceCode, alias, alias.name)
    return variable?.references.some(reference =>
      isComponentSetupReference(sourceCode, reference.identifier as NamedIdentifier, factoryName, seen)) ?? false
  }
  return isComponentSetupProperty(sourceCode, parent, expression, factoryName)
}

function isUnsafeSetupReference(
  sourceCode: Context['sourceCode'],
  identifier: NamedIdentifier,
  seen: Set<NamedIdentifier>,
): boolean {
  const { expression, parent } = transparentExpressionContext(identifier)
  if (parent?.type === 'CallExpression')
    return parent.callee === expression || parent.arguments.includes(expression as ESTree.Argument)
  if (parent?.type !== 'VariableDeclarator' || parent.init !== expression || parent.id.type !== 'Identifier')
    return false

  const alias = parent.id as NamedIdentifier
  if (seen.has(alias))
    return false
  seen.add(alias)
  const variable = findVariable(sourceCode, alias, alias.name)
  return variable?.references.some(reference =>
    isUnsafeSetupReference(sourceCode, reference.identifier as NamedIdentifier, seen)) ?? false
}

export function createComponentSetupMatcher(sourceCode: Context['sourceCode']): {
  collectImports: (program: ESTree.Program) => void
  isInScriptSetup: (node: ESTree.Node) => boolean
  isSetupFunction: (node: FunctionNode) => boolean
} {
  const setupRanges = scriptSetupRanges(sourceCode.parserServices)
  const { collectImports, importedCallName: componentFactoryName } = createImportedCallMatcher(sourceCode, {
    importSources: COMPONENT_IMPORT_SOURCES,
    names: COMPONENT_FACTORIES,
  })

  function isSetupFunction(node: FunctionNode): boolean {
    const { expression, parent } = transparentExpressionContext(node)
    if (isComponentFactoryCall(parent, expression, componentFactoryName))
      return true
    if (isComponentSetupProperty(sourceCode, parent, expression, componentFactoryName))
      return true

    const identifier = functionBindingIdentifier(node)
    if (!identifier)
      return false
    const references = findVariable(sourceCode, identifier, identifier.name)?.references ?? []
    return references.some(reference =>
      isComponentSetupReference(sourceCode, reference.identifier as NamedIdentifier, componentFactoryName, new Set([identifier])))
    && !references.some(reference =>
      isUnsafeSetupReference(sourceCode, reference.identifier as NamedIdentifier, new Set([identifier])))
  }

  return {
    collectImports,
    isInScriptSetup: node => isInRanges(node, setupRanges),
    isSetupFunction,
  }
}
