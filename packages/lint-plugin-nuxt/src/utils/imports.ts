import type { ESTree, SourceCode, Variable } from '@oxlint/plugins'
import { staticPropertyName, unwrapExpression } from './ast.js'
import { findVariable } from './scope.js'

interface ImportedCallMatcherOptions {
  importSources: ReadonlySet<string>
  names: ReadonlySet<string>
  includeTypeImports?: boolean
}

export function createImportedCallMatcher(sourceCode: SourceCode, options: ImportedCallMatcherOptions): {
  collectImports: (program: ESTree.Program) => void
  importedCallName: (call: ESTree.CallExpression) => string | undefined
} {
  type VariableIdentifier = Variable['identifiers'][number]

  const importedNames = new Map<VariableIdentifier, string>()
  const importedNamespaces = new Set<VariableIdentifier>()

  function collectImports(program: ESTree.Program): void {
    for (const node of program.body) {
      if (node.type !== 'ImportDeclaration' || !options.importSources.has(String(node.source.value)))
        continue
      if (!options.includeTypeImports && node.importKind === 'type')
        continue

      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          importedNamespaces.add(specifier.local)
          continue
        }
        if (specifier.type !== 'ImportSpecifier' || (!options.includeTypeImports && specifier.importKind === 'type'))
          continue

        const importedName = specifier.imported.type === 'Identifier'
          ? specifier.imported.name
          : String(specifier.imported.value)
        if (options.names.has(importedName))
          importedNames.set(specifier.local, importedName)
      }
    }
  }

  function importedCallName(call: ESTree.CallExpression): string | undefined {
    const callee = unwrapExpression(call.callee)
    if (callee?.type === 'Identifier') {
      const variable = findVariable(sourceCode, callee, callee.name)
      if (variable) {
        const identifier = variable.identifiers.find(item => importedNames.has(item))
        const importedName = identifier ? importedNames.get(identifier) : undefined
        if (importedName)
          return importedName
        if (variable.defs?.length !== 0)
          return
      }

      return options.names.has(callee.name) ? callee.name : undefined
    }
    if (callee?.type !== 'MemberExpression')
      return

    const name = staticPropertyName(callee)
    if (!name || !options.names.has(name))
      return

    const object = unwrapExpression(callee.object)
    if (object?.type !== 'Identifier')
      return
    const variable = findVariable(sourceCode, object, object.name)
    return variable?.identifiers.some(identifier => importedNamespaces.has(identifier))
      ? name
      : undefined
  }

  return { collectImports, importedCallName }
}
