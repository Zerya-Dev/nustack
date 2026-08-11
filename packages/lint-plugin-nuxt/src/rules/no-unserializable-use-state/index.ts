import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { isTransparentExpression } from '../../utils/ast.js'
import { docsUrl } from '../../utils/docs-url.js'

type Initializer = ESTree.ArrowFunctionExpression | ESTree.Function
interface Options {
  allowConstructors?: string[]
}

const SERIALIZABLE_CONSTRUCTORS = new Set([
  'Array',
  'ArrayBuffer',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'Float16Array',
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Number',
  'Object',
  'RegExp',
  'Set',
  'String',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'URL',
  'URLSearchParams',
])
const UNSERIALIZABLE_CONSTRUCTORS = new Set(['Function', 'Promise', 'Symbol', 'WeakMap', 'WeakRef', 'WeakSet'])

function calleeName(node: ESTree.Expression): string | undefined {
  if (node.type === 'Identifier')
    return node.name

  if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') {
    const object = calleeName(node.object as ESTree.Expression)
    return object ? `${object}.${node.property.name}` : undefined
  }
}

function isSymbolExpression(node: ESTree.Expression): boolean {
  if (node.type === 'MemberExpression' && node.object.type === 'Identifier' && node.object.name === 'Symbol')
    return true
  return node.type === 'CallExpression'
    && (calleeName(node.callee) === 'Symbol' || isSymbolExpression(node.callee))
}

function isPromiseExpression(node: ESTree.Expression): boolean {
  if (node.type !== 'CallExpression')
    return false
  const name = calleeName(node.callee)
  return name === 'Promise' || name?.startsWith('Promise.') === true
}

function unsupportedType(node: ESTree.Expression, allowedConstructors: Set<string>): string | undefined {
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression')
    return 'a function'
  if (node.type === 'ClassExpression')
    return 'a class'
  if (isSymbolExpression(node))
    return 'a symbol'
  if (isPromiseExpression(node))
    return 'a Promise'
  if (node.type === 'NewExpression') {
    const name = calleeName(node.callee)
    const [qualifier, baseName] = name?.includes('.') ? [name.slice(0, name.lastIndexOf('.')), name.slice(name.lastIndexOf('.') + 1)] : [undefined, name]
    if (baseName && UNSERIALIZABLE_CONSTRUCTORS.has(baseName)
      && (qualifier === undefined || qualifier === 'globalThis' || qualifier === 'global' || qualifier === 'window')) {
      return baseName === 'Promise' ? 'a Promise' : `an instance of \`${name}\``
    }
    if (name?.startsWith('Temporal.') || (name && (SERIALIZABLE_CONSTRUCTORS.has(name) || allowedConstructors.has(name))))
      return
    return name ? `an instance of \`${name}\`` : 'a class instance'
  }
}

function isInitializer(node: ESTree.Argument): node is Initializer {
  return node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression'
}

function initializer(call: ESTree.CallExpression): Initializer | undefined {
  return call.arguments.find((argument: ESTree.Argument, index: number): argument is Initializer =>
    index < 2 && isInitializer(argument),
  )
}

export const noUnserializableUseState: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow values that Nuxt cannot serialize in `useState` initializers.',
      url: docsUrl('no-unserializable-use-state'),
    },
    schema: [{
      type: 'object',
      properties: {
        allowConstructors: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
        },
      },
      additionalProperties: false,
    }],
    messages: {
      unserializable: '`useState()` initializes with {{ type }}, which Nuxt\'s default payload serializer cannot serialize.',
    },
  },
  create(context: Context): Visitor {
    const options = (context.options?.[0] ?? {}) as Options
    const allowedConstructors = new Set(options.allowConstructors ?? [])

    function report(node: ESTree.Node, type: string): void {
      context.report({ node, messageId: 'unserializable', data: { type } })
    }

    function checkObjectKey(property: ESTree.ObjectProperty): void {
      if (property.computed && isSymbolExpression(property.key as ESTree.Expression))
        report(property.key, 'a symbol-keyed property')
    }

    function checkValue(node: ESTree.Expression): void {
      const type = unsupportedType(node, allowedConstructors)
      if (type) {
        report(node, type)
        return
      }

      if (isTransparentExpression(node)) {
        if (node.expression)
          checkValue(node.expression)
        return
      }

      switch (node.type) {
        case 'ArrayExpression':
          for (const element of node.elements) {
            if (element)
              checkValue(element.type === 'SpreadElement' ? element.argument : element)
          }
          break
        case 'AssignmentExpression':
        case 'AwaitExpression':
          checkValue(node.type === 'AssignmentExpression' ? node.right : node.argument)
          break
        case 'ConditionalExpression':
          checkValue(node.consequent)
          checkValue(node.alternate)
          break
        case 'LogicalExpression':
          checkValue(node.left)
          checkValue(node.right)
          break
        case 'ObjectExpression':
          for (const property of node.properties) {
            if (property.type === 'SpreadElement') {
              checkValue(property.argument)
              continue
            }
            checkObjectKey(property)
            checkValue(property.value)
          }
          break
        case 'SequenceExpression':
          if (node.expressions.length)
            checkValue(node.expressions.at(-1)!)
          break
      }
    }

    function checkReturns(node: ESTree.Node): void {
      if (node.type === 'ReturnStatement') {
        if (node.argument)
          checkValue(node.argument)
        return
      }
      if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression')
        return

      const keys = context.sourceCode.visitorKeys[node.type] ?? []
      for (const key of keys) {
        const child = (node as ESTree.Node & Record<string, ESTree.Node | ESTree.Node[] | null | undefined>)[key]
        if (Array.isArray(child)) {
          for (const item of child) {
            if (item?.type)
              checkReturns(item)
          }
        }
        else if (child?.type) {
          checkReturns(child)
        }
      }
    }

    return {
      CallExpression(node: ESTree.CallExpression): void {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'useState')
          return

        const init = initializer(node)
        if (!init)
          return
        if (init.async) {
          report(init, 'a Promise')
          return
        }
        if (init.generator) {
          report(init, 'a generator')
          return
        }
        if (!init.body)
          return
        if (init.body.type === 'BlockStatement')
          checkReturns(init.body)
        else
          checkValue(init.body)
      },
    }
  },
}
