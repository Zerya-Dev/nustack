export function isStaticMember(node: any, objectName: string, propertyName: string) {
  return node?.type === 'MemberExpression'
    && node.object?.type === 'Identifier'
    && node.object.name === objectName
    && !node.computed
    && node.property?.type === 'Identifier'
    && node.property.name === propertyName
}

export function isStaticMemberOf(node: any, objectName: string, propertyNames: readonly string[]) {
  return node?.type === 'MemberExpression'
    && node.object?.type === 'Identifier'
    && node.object.name === objectName
    && !node.computed
    && node.property?.type === 'Identifier'
    && propertyNames.includes(node.property.name)
}

export function isIdentifierCall(node: any, names: readonly string[]) {
  return node?.type === 'CallExpression'
    && node.callee?.type === 'Identifier'
    && names.includes(node.callee.name)
}

export function isMemberCall(node: any, objectName: string, propertyNames: readonly string[]) {
  return node?.type === 'CallExpression'
    && isStaticMemberOf(node.callee, objectName, propertyNames)
}
