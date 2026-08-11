import type { ESTree } from '@oxlint/plugins'
import { staticLiteralString } from './ast.js'

export interface NuxtModuleEntry {
  name: string
  node: ESTree.Node
}

export function nuxtModuleEntry(element: ESTree.ArrayExpressionElement): NuxtModuleEntry | undefined {
  const name = staticLiteralString(element)
  if (name !== undefined && element)
    return { name, node: element }
  if (element?.type !== 'ArrayExpression' || element.elements.length === 0)
    return

  const first = element.elements[0]
  const firstName = staticLiteralString(first)
  if (firstName !== undefined && first)
    return { name: firstName, node: first }
}
