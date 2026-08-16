import type { AST as VueAST } from 'vue-eslint-parser'
import { parseForESLint } from 'vue-eslint-parser'

export function elements(template: string): VueAST.VElement[] {
  const { ast } = parseForESLint(`<template>${template}</template>`, {
    sourceType: 'module',
    ecmaVersion: 'latest',
  })
  const body = ast.templateBody
  if (!body)
    throw new Error('template did not parse')
  return body.children.filter((child): child is VueAST.VElement => child.type === 'VElement')
}

export function element(template: string): VueAST.VElement {
  const [first] = elements(template)
  if (!first)
    throw new Error('template contains no element')
  return first
}
