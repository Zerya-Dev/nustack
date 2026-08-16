import type { Context, ESTree } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'

const LAZY_PREFIX = 'lazy'

export function normalizeComponentKey(name: string): string {
  return name.replaceAll('-', '').toLowerCase()
}

export function isComponentName(name: string): boolean {
  return /[A-Z-]/.test(name)
}

export function isComponentElement(node: VueAST.VElement): boolean {
  return isComponentName(elementName(node))
}

// The parser lowercases `<Table>` to `table`, while SVG also has tags such as `<a>`.
export function isNativeHtmlElement(node: VueAST.VElement): boolean {
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'

  return node.namespace === HTML_NAMESPACE && !isComponentElement(node)
}

export function isNativeElement(node: VueAST.VElement, tag: string): boolean {
  return node.name === tag && isNativeHtmlElement(node)
}

export interface ComponentSource {
  module: RegExp
  prefix: string
}

export interface ComponentMatcher {
  is: (node: VueAST.VElement, name: string) => boolean
  matchOf: (node: VueAST.VElement, names: Iterable<string>) => string | null
  isOneOf: (node: VueAST.VElement, names: Iterable<string>) => boolean
  hasAncestor: (node: VueAST.VElement, name: string) => boolean
  keyOf: (node: VueAST.VElement) => string | null
  keyOfName: (name: string) => string | null
  prefixed: (name: string) => string
  rawName: (node: VueAST.VElement) => string
}

function elementName(node: VueAST.VElement): string {
  return node.rawName ?? node.name
}

function isTypeOnly(node: object): boolean {
  return (node as { importKind?: string }).importKind === 'type'
}

function dynamicIsName(node: VueAST.VElement): string | null {
  const attribute = node.startTag.attributes.find((candidate) => {
    if (!candidate.directive)
      return candidate.key.name === 'is'
    if (candidate.key.name.name !== 'bind')
      return false
    return candidate.key.argument?.type === 'VIdentifier' && candidate.key.argument.name === 'is'
  })
  if (!attribute)
    return null
  if (!attribute.directive)
    return attribute.value?.value ?? null

  const expression = attribute.value?.expression
  if (expression?.type === 'Identifier')
    return expression.name
  if (expression?.type === 'Literal' && typeof expression.value === 'string')
    return expression.value
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0)
    return expression.quasis[0]?.value.cooked ?? expression.quasis[0]?.value.raw ?? null
  return null
}

export function elementAncestor(node: VueAST.VElement): VueAST.VElement | null {
  let current: VueAST.Node | null | undefined = node.parent
  while (current) {
    if (current.type === 'VElement')
      return current
    current = 'parent' in current ? current.parent : null
  }
  return null
}

function patternNames(pattern: ESTree.BindingPattern | ESTree.BindingRestElement): string[] {
  switch (pattern.type) {
    case 'Identifier':
      return [normalizeComponentKey(pattern.name)]
    case 'ObjectPattern':
      return pattern.properties.flatMap(property => property.type === 'Property'
        ? patternNames(property.value as ESTree.BindingPattern)
        : patternNames(property.argument))
    case 'ArrayPattern':
      return pattern.elements.flatMap(element => element ? patternNames(element as ESTree.BindingPattern) : [])
    case 'AssignmentPattern':
      return patternNames(pattern.left)
    case 'RestElement':
      return patternNames(pattern.argument)
    default:
      return []
  }
}

function declaredNames(statement: ESTree.Statement): string[] {
  if (statement.type === 'VariableDeclaration')
    return statement.declarations.flatMap(declarator => patternNames(declarator.id))
  if ((statement.type === 'FunctionDeclaration' || statement.type === 'ClassDeclaration') && statement.id)
    return [normalizeComponentKey(statement.id.name)]
  return []
}

export function createComponentMatcher(context: Context, source: ComponentSource): ComponentMatcher {
  const { module: moduleId, prefix } = source
  const prefixKey = normalizeComponentKey(prefix)

  function stripPrefixes(name: string): string | null {
    let key = normalizeComponentKey(name)
    if (key.startsWith(LAZY_PREFIX))
      key = key.slice(LAZY_PREFIX.length)
    if (!key.startsWith(prefixKey))
      return null
    const stripped = key.slice(prefixKey.length)
    return stripped.length > 0 ? stripped : null
  }

  // `null` marks local shadowing by a component outside the module.
  const bindings = new Map<string, string | null>()
  const namespaces = new Set<string>()
  const body = context.sourceCode?.ast?.body ?? []

  for (const statement of body) {
    if (statement.type !== 'ImportDeclaration' || isTypeOnly(statement))
      continue

    const specifier = typeof statement.source.value === 'string' ? statement.source.value : ''
    const fromModule = moduleId.test(specifier)

    for (const imported of statement.specifiers) {
      if (isTypeOnly(imported))
        continue

      if (imported.type === 'ImportSpecifier') {
        const name = imported.imported.type === 'Identifier'
          ? imported.imported.name
          : imported.imported.value
        bindings.set(
          normalizeComponentKey(imported.local.name),
          fromModule ? stripPrefixes(name) : null,
        )
        continue
      }

      if (imported.type === 'ImportDefaultSpecifier') {
        const file = fromModule ? specifier.split('/').pop()?.replace(/\.vue$/, '') : undefined
        bindings.set(normalizeComponentKey(imported.local.name), file ? normalizeComponentKey(file) : null)
        continue
      }

      if (imported.type === 'ImportNamespaceSpecifier' && fromModule)
        namespaces.add(normalizeComponentKey(imported.local.name))
    }
  }

  for (const statement of body) {
    for (const key of declaredNames(statement)) {
      if (!bindings.has(key))
        bindings.set(key, null)
    }
  }

  function effectiveName(node: VueAST.VElement): string | null {
    const raw = elementName(node)
    return normalizeComponentKey(raw) === 'component' ? dynamicIsName(node) : raw
  }

  function keyOf(node: VueAST.VElement): string | null {
    const name = effectiveName(node)
    if (name === null)
      return null
    const bound = bindings.get(normalizeComponentKey(name))
    if (bound !== undefined)
      return bound
    const dot = name.indexOf('.')
    if (dot > 0 && namespaces.has(normalizeComponentKey(name.slice(0, dot))))
      return stripPrefixes(name.slice(dot + 1))
    // Without this guard, an empty prefix would match native tags.
    if (!isComponentName(name))
      return null
    return stripPrefixes(name)
  }

  function namesKey(name: string, key: string): boolean {
    return normalizeComponentKey(name) === key || stripPrefixes(name) === key
  }

  function matchOf(node: VueAST.VElement, names: Iterable<string>): string | null {
    const key = keyOf(node)
    if (key === null)
      return null
    for (const name of names) {
      if (namesKey(name, key))
        return name
    }
    return null
  }

  function is(node: VueAST.VElement, name: string): boolean {
    const key = keyOf(node)
    return key !== null && namesKey(name, key)
  }

  return {
    is,
    matchOf,
    isOneOf: (node, names) => matchOf(node, names) !== null,
    hasAncestor: (node, name) => {
      let parent = elementAncestor(node)
      while (parent) {
        if (is(parent, name))
          return true
        parent = elementAncestor(parent)
      }
      return false
    },
    keyOf,
    keyOfName: stripPrefixes,
    prefixed: name => `${prefix}${name}`,
    rawName: elementName,
  }
}
