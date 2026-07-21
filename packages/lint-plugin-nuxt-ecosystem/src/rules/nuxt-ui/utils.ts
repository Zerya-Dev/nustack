/** Note: `vue-eslint-parser` lowercases element names, so match `node.name` lowercased. */
export function defineTemplateVisitor(context: any, visitor: Record<string, (node: any) => void>) {
  const services = context.sourceCode.parserServices
  if (typeof services?.defineTemplateBodyVisitor !== 'function')
    return {}

  return services.defineTemplateBodyVisitor(visitor)
}

export function hasRawOptOut(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
}
