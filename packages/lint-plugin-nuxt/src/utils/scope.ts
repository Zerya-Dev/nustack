import type { ESTree, Scope, SourceCode, Variable } from '@oxlint/plugins'
import type { FunctionNode } from './ast.js'
import { functionBindingIdentifier } from './ast.js'

export function findVariable(sourceCode: SourceCode, node: ESTree.Node, name: string): Variable | undefined {
  let scope: Scope | null = sourceCode.getScope(node)
  while (scope) {
    const variable = scope.set?.get(name)
    if (variable)
      return variable
    scope = scope.upper
  }
}

export function functionBindingReferences(sourceCode: SourceCode, node: FunctionNode): ESTree.Node[] | undefined {
  const identifier = functionBindingIdentifier(node)
  if (!identifier)
    return
  return findVariable(sourceCode, identifier, identifier.name)?.references.map(reference => reference.identifier)
}
