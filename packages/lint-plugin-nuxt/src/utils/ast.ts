import type { ESTree } from '@oxlint/plugins'

export type FunctionNode = ESTree.ArrowFunctionExpression | ESTree.Function
export type NamedIdentifier = ESTree.Node & { type: 'Identifier', name: string }

export type TransparentExpression
  = | ESTree.ChainExpression
    | ESTree.TSAsExpression
    | ESTree.TSInstantiationExpression
    | ESTree.TSNonNullExpression
    | ESTree.TSSatisfiesExpression
    | ESTree.TSTypeAssertion

export const TRANSPARENT_EXPRESSION_NODES = new Set([
  'ChainExpression',
  'TSAsExpression',
  'TSInstantiationExpression',
  'TSNonNullExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion',
])

export function isTransparentExpression(node: ESTree.Node | null | undefined): node is TransparentExpression {
  return node !== null && node !== undefined && TRANSPARENT_EXPRESSION_NODES.has(node.type)
}

export function isFunctionNode(node: ESTree.Node): node is FunctionNode {
  return node.type === 'ArrowFunctionExpression'
    || node.type === 'FunctionDeclaration'
    || node.type === 'FunctionExpression'
}

export function transparentExpressionContext(node: ESTree.Node): { expression: ESTree.Node, parent: ESTree.Node | null } {
  let expression = node
  let parent = node.parent
  while (isTransparentExpression(parent) && parent.expression === expression) {
    expression = parent
    parent = parent.parent
  }
  return { expression, parent }
}

export function functionBindingIdentifier(node: FunctionNode): NamedIdentifier | undefined {
  if (node.type === 'FunctionDeclaration')
    return node.id as NamedIdentifier | null ?? undefined

  const { parent } = transparentExpressionContext(node)
  return parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier'
    ? parent.id as NamedIdentifier
    : undefined
}

export function functionName(node: FunctionNode): string | undefined {
  if (node.type === 'FunctionDeclaration')
    return node.id?.name

  const { expression, parent } = transparentExpressionContext(node)
  if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier')
    return parent.id.name
  if ((parent?.type === 'Property' || parent?.type === 'MethodDefinition') && parent.value === expression)
    return staticPropertyName(parent as ESTree.ObjectProperty | ESTree.MethodDefinition, true)
}

export function unwrapExpression(node: ESTree.Expression): ESTree.Expression
export function unwrapExpression(node: ESTree.Expression | null | undefined): ESTree.Expression | undefined
export function unwrapExpression(node: ESTree.Expression | null | undefined): ESTree.Expression | undefined {
  while (isTransparentExpression(node))
    node = node.expression ?? undefined
  return node ?? undefined
}

export function staticLiteralString(node: ESTree.Node | null | undefined): string | undefined {
  return node?.type === 'Literal' && typeof node.value === 'string'
    ? node.value
    : undefined
}

export function staticKeyName(key: ESTree.Node | null | undefined): string | undefined {
  if (key?.type === 'Identifier')
    return key.name
  return staticLiteralString(key)
}

type PropertyLike
  = | ESTree.AssignmentTargetPropertyIdentifier
    | ESTree.AssignmentTargetPropertyProperty
    | ESTree.BindingProperty
    | ESTree.MemberExpression
    | ESTree.MethodDefinition
    | ESTree.ObjectProperty

export function staticPropertyName(node: PropertyLike, literalRequiresComputed = false): string | undefined {
  const property = 'key' in node ? node.key : node.property
  if (node?.computed && property?.type === 'Identifier')
    return
  if (literalRequiresComputed && !node?.computed && property?.type === 'Literal')
    return
  return staticKeyName(property)
}

interface StaticStringOptions {
  fallbackToRaw?: boolean
  unwrap?: boolean
}

export function staticString(node: ESTree.Node | null | undefined, options: StaticStringOptions = {}): string | undefined {
  const expression = options.unwrap && node && 'type' in node
    ? unwrapExpression(node as ESTree.Expression)
    : node
  const literal = staticLiteralString(expression)
  if (literal !== undefined)
    return literal
  if (expression?.type !== 'TemplateLiteral' || expression.expressions.length > 0)
    return

  const quasi = expression.quasis[0]?.value
  return quasi?.cooked ?? (options.fallbackToRaw ? quasi?.raw : undefined)
}
