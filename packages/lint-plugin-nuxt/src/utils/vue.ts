import type { ESTree } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'

export type SourceRange = [number, number]

interface DocumentFragmentServices {
  getDocumentFragment: () => VueAST.VDocumentFragment | null
}

function hasDocumentFragmentServices(
  services: Readonly<Record<string, unknown>>,
): services is Readonly<Record<string, unknown>> & DocumentFragmentServices {
  return typeof services.getDocumentFragment === 'function'
}

export function scriptSetupRanges(services: Readonly<Record<string, unknown>>): SourceRange[] {
  if (!hasDocumentFragmentServices(services))
    return []

  const ranges: SourceRange[] = []
  for (const child of services.getDocumentFragment()?.children ?? []) {
    if (child.type !== 'VElement' || child.rawName !== 'script')
      continue
    if (!child.startTag.attributes.some(attribute =>
      attribute.type === 'VAttribute'
      && !attribute.directive
      && attribute.key.name === 'setup',
    )) { continue }

    const contentStart = child.startTag.range?.[1]
    const contentEnd = child.endTag?.range?.[0] ?? child.range?.[1]
    if (typeof contentStart === 'number' && typeof contentEnd === 'number')
      ranges.push([contentStart, contentEnd])
  }
  return ranges
}

export function isInRanges(node: ESTree.Node, ranges: SourceRange[]): boolean {
  const start = node.range?.[0]
  return typeof start === 'number' && ranges.some(([from, to]) => from <= start && start < to)
}
