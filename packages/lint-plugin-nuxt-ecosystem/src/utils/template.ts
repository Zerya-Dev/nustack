import type { Context, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { isComponentElement } from './component-matcher.js'

type ExpressionNode
  = | NonNullable<VueAST.VExpressionContainer['expression']>
    | VueAST.ESLintPattern
    | VueAST.ESLintSpreadElement

interface TemplateVisitor {
  'VElement'?: (node: VueAST.VElement) => void
  'VElement:exit'?: (node: VueAST.VElement) => void
  'VText'?: (node: VueAST.VText) => void
  'VExpressionContainer'?: (node: VueAST.VExpressionContainer) => void
  'VDocumentFragment'?: (node: VueAST.VDocumentFragment) => void
  [selector: string]: ((node: never) => void) | undefined
}

export function defineTemplateVisitor(context: Context, visitor: TemplateVisitor): Visitor {
  const services = context.sourceCode.parserServices as {
    defineTemplateBodyVisitor?: (templateVisitor: TemplateVisitor) => unknown
  }
  if (typeof services?.defineTemplateBodyVisitor !== 'function')
    return {}

  return services.defineTemplateBodyVisitor(visitor) as Visitor
}

export function documentRoot(node: VueAST.Node | null | undefined): VueAST.Node | null {
  let root: VueAST.Node | null | undefined = node
  while (root && 'parent' in root && root.parent)
    root = root.parent
  return root ?? null
}

function childNodes(node: VueAST.Node): VueAST.VElement['children'] {
  return node.type === 'VElement' || node.type === 'VDocumentFragment' ? node.children : []
}

export function findElement(
  root: VueAST.Node | null | undefined,
  predicate: (node: VueAST.VElement) => boolean,
): VueAST.VElement | null {
  if (!root)
    return null
  if (root.type === 'VElement' && predicate(root))
    return root
  for (const child of childNodes(root)) {
    const found = findElement(child, predicate)
    if (found)
      return found
  }
  return null
}

export interface AttributeValue {
  present: boolean
  definite: boolean
  known: boolean
  value: unknown
  expression?: ExpressionNode
}

const ABSENT_ATTRIBUTE: AttributeValue = { present: false, definite: false, known: true, value: undefined }
const UNKNOWN_ATTRIBUTE: AttributeValue = { present: true, definite: true, known: false, value: undefined }
const UNKNOWN_SPREAD: AttributeValue = { present: true, definite: false, known: false, value: undefined }

function staticValue(value: unknown, expression: ExpressionNode): AttributeValue {
  return { present: true, definite: value !== undefined && value !== null, known: true, value, expression }
}

function propertyName(property: VueAST.ESLintProperty): string | null {
  if (property.computed) {
    return property.key.type === 'Literal' && typeof property.key.value === 'string'
      ? property.key.value
      : null
  }
  if (property.key.type === 'Identifier')
    return property.key.name
  return property.key.type === 'Literal' ? String(property.key.value) : null
}

export function normalizePropName(name: string): string {
  return name.replaceAll('-', '').toLowerCase()
}

function staticExpression(expression: ExpressionNode | null | undefined): AttributeValue {
  if (!expression)
    return UNKNOWN_ATTRIBUTE
  if (expression.type === 'Literal')
    return staticValue(expression.value, expression)
  if (expression.type === 'Identifier' && expression.name === 'undefined')
    return staticValue(undefined, expression)
  if (expression.type === 'TemplateLiteral' && expression.expressions.length === 0) {
    const quasi = expression.quasis[0]?.value
    return staticValue(quasi?.cooked ?? quasi?.raw ?? '', expression)
  }
  if (expression.type === 'ArrayExpression') {
    const values = []
    for (const element of expression.elements) {
      const value = staticExpression(element)
      if (!value.known)
        return UNKNOWN_ATTRIBUTE
      values.push(value.value)
    }
    return { present: true, definite: true, known: true, value: values, expression }
  }
  return { ...UNKNOWN_ATTRIBUTE, expression }
}

function objectPropertyValue(expression: ExpressionNode | null | undefined, name: string): AttributeValue {
  if (expression?.type !== 'ObjectExpression')
    return UNKNOWN_SPREAD

  for (let index = expression.properties.length - 1; index >= 0; index--) {
    const property = expression.properties[index]
    if (property?.type === 'SpreadElement') {
      const spread = objectPropertyValue(property.argument, name)
      if (spread.present)
        return spread
      continue
    }
    if (property?.type !== 'Property')
      continue
    const key = propertyName(property)
    if (key === null)
      return UNKNOWN_SPREAD
    if (normalizePropName(key) !== normalizePropName(name))
      continue
    return staticExpression(property.value)
  }

  return ABSENT_ATTRIBUTE
}

export function getAttributeValue(node: VueAST.VElement, name: string): AttributeValue {
  for (let index = node.startTag.attributes.length - 1; index >= 0; index--) {
    const attribute = node.startTag.attributes[index]
    if (!attribute)
      continue
    if (!attribute.directive) {
      if (normalizePropName(attribute.key.name) !== normalizePropName(name))
        continue
      return {
        present: true,
        definite: true,
        known: true,
        value: attribute.value ? attribute.value.value : true,
      }
    }
    if (attribute.key.name.name !== 'bind')
      continue

    const argument = attribute.key.argument
    if (argument?.type === 'VIdentifier' && normalizePropName(argument.name) === normalizePropName(name))
      return staticExpression(attribute.value?.expression)
    if (!argument) {
      const candidate = objectPropertyValue(attribute.value?.expression, name)
      if (candidate.present)
        return candidate
    }
  }

  return ABSENT_ATTRIBUTE
}

export function hasAttribute(node: VueAST.VElement, name: string): boolean {
  return getAttributeValue(node, name).present
}

export function hasDefiniteAttribute(node: VueAST.VElement, name: string): boolean {
  return getAttributeValue(node, name).definite
}

export function hasNonEmptyAttribute(node: VueAST.VElement, name: string): boolean {
  const attribute = getAttributeValue(node, name)
  if (!attribute.present)
    return false
  if (!attribute.known)
    return true
  if (typeof attribute.value === 'string')
    return attribute.value.trim().length > 0
  if (Array.isArray(attribute.value))
    return attribute.value.length > 0
  return typeof attribute.value === 'number'
}

export function getStaticAttribute(node: VueAST.VElement, name: string): string | null {
  const attribute = getAttributeValue(node, name)
  return attribute.present && attribute.known && typeof attribute.value === 'string'
    ? attribute.value
    : null
}

export function getStaticBoolean(node: VueAST.VElement, name: string): boolean | null {
  const attribute = getAttributeValue(node, name)
  if (!attribute.present || !attribute.known)
    return null
  if (typeof attribute.value === 'boolean')
    return attribute.value
  if (attribute.value === '' || attribute.value === 'true')
    return true
  if (attribute.value === 'false')
    return false
  return null
}

function hasMeaningfulChildren(node: VueAST.VElement, isDecorative: (node: VueAST.VElement) => boolean): boolean {
  return node.children.some((child) => {
    if (child.type === 'VText')
      return child.value.trim().length > 0
    if (child.type === 'VExpressionContainer')
      return expressionHasContent(child.expression)
    if (isDecorative(child) || isStaticallyHidden(child))
      return false
    if (hasNonEmptyAttribute(child, 'alt'))
      return true
    return isComponentElement(child)
      ? componentProvidesContent(child, isDecorative)
      : hasMeaningfulChildren(child, isDecorative)
  })
}

export function isStaticallyHidden(node: VueAST.VElement): boolean {
  if (getStaticBoolean(node, 'aria-hidden') === true)
    return true
  if (getStaticBoolean(node, 'hidden') === true)
    return true
  return node.startTag.attributes.some((attribute) => {
    if (!attribute.directive)
      return false
    const directive = attribute.key.name.name
    if (directive !== 'if' && directive !== 'show')
      return false
    const condition = staticExpression(attribute.value?.expression)
    return condition.known && !condition.value
  })
}

const TRANSPARENT_BUILT_INS = new Set(['component', 'keepalive', 'suspense', 'teleport', 'transition', 'transitiongroup'])

function componentProvidesContent(node: VueAST.VElement, isDecorative: (node: VueAST.VElement) => boolean): boolean {
  const key = (node.rawName ?? node.name).replaceAll('-', '').toLowerCase()
  return !TRANSPARENT_BUILT_INS.has(key) || hasMeaningfulChildren(node, isDecorative)
}

function expressionHasContent(expression: ExpressionNode | null): boolean {
  const value = staticExpression(expression)
  return value.known ? hasNonEmptyStaticValue(value.value) : true
}

function hasNonEmptyStaticValue(value: unknown): boolean {
  if (typeof value === 'string')
    return value.trim().length > 0
  return typeof value === 'number'
}

function slotName(attribute: VueAST.VDirective): string | null | undefined {
  const argument = attribute.key.argument
  if (!argument)
    return undefined
  if (argument.type === 'VIdentifier')
    return argument.name
  const value = staticExpression(argument.expression)
  return value.known && typeof value.value === 'string' ? value.value : null
}

function isSlotFor(attribute: VueAST.VAttribute | VueAST.VDirective, name: string): boolean {
  if (!attribute.directive || attribute.key.name.name !== 'slot')
    return false
  const resolved = slotName(attribute)
  return resolved === null || resolved === name
}

export function hasSlot(node: VueAST.VElement, name: string, isDecorative: (node: VueAST.VElement) => boolean = () => false): boolean {
  return node.children.some(child => child.type === 'VElement'
    && !isStaticallyHidden(child)
    && child.startTag.attributes.some(attribute => isSlotFor(attribute, name))
    && hasMeaningfulChildren(child, isDecorative))
}

export function hasLabelContent(node: VueAST.VElement, isDecorative: (node: VueAST.VElement) => boolean = () => false): boolean {
  return hasMeaningfulChildren(node, isDecorative)
}

export function hasDirective(node: VueAST.VElement, name: string): boolean {
  return node.startTag.attributes.some(attribute => attribute.directive && attribute.key.name.name === name)
}

export function hasVModel(node: VueAST.VElement, argumentName: string | null): boolean {
  return node.startTag.attributes.some((attribute) => {
    if (!attribute.directive || attribute.key.name.name !== 'model')
      return false
    const argument = attribute.key.argument
    if (argumentName === null)
      return !argument
    if (argument?.type === 'VIdentifier')
      return argument.name === argumentName
    if (argument?.type !== 'VExpressionContainer')
      return false
    const value = staticExpression(argument.expression)
    return value.known && value.value === argumentName
  })
}
