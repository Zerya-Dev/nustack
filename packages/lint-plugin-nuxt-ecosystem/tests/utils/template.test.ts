import type { AST as VueAST } from 'vue-eslint-parser'
import { describe, expect, it } from 'vitest'
import {
  documentRoot,
  findElement,
  getAttributeValue,
  getStaticAttribute,
  getStaticBoolean,
  hasAttribute,
  hasDefiniteAttribute,
  hasDirective,
  hasLabelContent,
  hasNonEmptyAttribute,
  hasSlot,
  hasVModel,
  isStaticallyHidden,
} from '../../src/utils/template.js'
import { element } from '../parse.js'

describe('getAttributeValue', () => {
  it('reads a plain attribute, valueless or not', () => {
    expect(getAttributeValue(element('<UInput placeholder="Email" />'), 'placeholder'))
      .toMatchObject({ present: true, definite: true, known: true, value: 'Email' })
    expect(getAttributeValue(element('<UInput disabled />'), 'disabled'))
      .toMatchObject({ present: true, definite: true, known: true, value: true })
    expect(getAttributeValue(element('<UInput />'), 'disabled'))
      .toMatchObject({ present: false, definite: false, known: true })
  })

  it('evaluates the expressions that are as static as a literal', () => {
    const value = (code: string) => getAttributeValue(element(code), 'open')
    expect(value('<UModal :open="true" />')).toMatchObject({ known: true, definite: true, value: true })
    expect(value('<UModal :open="\'yes\'" />')).toMatchObject({ known: true, value: 'yes' })
    expect(value('<UModal :open="`yes`" />')).toMatchObject({ known: true, value: 'yes' })
    expect(value('<UModal :open="[1, 2]" />')).toMatchObject({ known: true, value: [1, 2] })
    expect(value('<UModal :open="undefined" />')).toMatchObject({ present: true, definite: false, known: true })
    expect(value('<UModal :open="null" />')).toMatchObject({ present: true, definite: false, known: true })
  })

  it('gives up on anything it cannot prove', () => {
    const value = (code: string) => getAttributeValue(element(code), 'open')
    expect(value('<UModal :open="isOpen" />')).toMatchObject({ present: true, definite: true, known: false })
    // eslint-disable-next-line no-template-curly-in-string -- Vue source, not JS interpolation.
    expect(value('<UModal :open="`${a}`" />')).toMatchObject({ known: false })
    expect(value('<UModal :open="[1, unknown]" />')).toMatchObject({ known: false })
  })

  it('normalizes prop spelling and lets the last duplicate win', () => {
    expect(getAttributeValue(element('<UInput modelValue="value" />'), 'model-value'))
      .toMatchObject({ known: true, value: 'value' })
    expect(getAttributeValue(element('<UInput :modelValue="1" />'), 'model-value'))
      .toMatchObject({ known: true, value: 1 })
    expect(getAttributeValue(element('<UInput v-bind="{ \'model-value\': 1 }" />'), 'modelValue'))
      .toMatchObject({ known: true, value: 1 })
    expect(getAttributeValue(element('<UInput v-bind="{ modelValue: 1 }" />'), 'model-value'))
      .toMatchObject({ known: true, value: 1 })
    expect(getAttributeValue(element('<UInput :value="\'a\'" :value="\'b\'" />'), 'value'))
      .toMatchObject({ value: 'b' })
  })

  it('reads through a v-bind object, including nested spreads', () => {
    const value = (code: string) => getAttributeValue(element(code), 'multiple')
    expect(value('<UFileUpload v-bind="{ multiple: true }" />')).toMatchObject({ known: true, value: true })
    expect(value('<UFileUpload v-bind="{ ...defaults, multiple: false }" />')).toMatchObject({ known: true, value: false })
    expect(value('<UFileUpload v-bind="{ ...defaults }" />')).toMatchObject({ present: true, definite: false, known: false })
    expect(value('<UFileUpload v-bind="{ [key]: true }" />')).toMatchObject({ known: false })
    expect(value('<UFileUpload v-bind="props" />')).toMatchObject({ known: false })
  })

  it('prefers an explicit prop over the same key inside v-bind', () => {
    expect(getAttributeValue(element('<UFileUpload v-bind="{ multiple: true }" :multiple="false" />'), 'multiple'))
      .toMatchObject({ known: true, value: false })
  })
})

describe('attribute predicates', () => {
  it('separates presence from actually supplying a value', () => {
    expect(hasAttribute(element('<UModal :open="undefined" />'), 'open')).toBe(true)
    expect(hasDefiniteAttribute(element('<UModal :open="undefined" />'), 'open')).toBe(false)
    expect(hasDefiniteAttribute(element('<UModal :open="isOpen" />'), 'open')).toBe(true)
  })

  it('treats whitespace and empty collections as empty', () => {
    expect(hasNonEmptyAttribute(element('<UAvatar alt="Face" />'), 'alt')).toBe(true)
    expect(hasNonEmptyAttribute(element('<UAvatar alt="" />'), 'alt')).toBe(false)
    expect(hasNonEmptyAttribute(element('<UAvatar alt="   " />'), 'alt')).toBe(false)
    expect(hasNonEmptyAttribute(element('<UKbd :value="[]" />'), 'value')).toBe(false)
    expect(hasNonEmptyAttribute(element('<UKbd :value="[1]" />'), 'value')).toBe(true)
    expect(hasNonEmptyAttribute(element('<UProgress :value="0" />'), 'value')).toBe(true)
    expect(hasNonEmptyAttribute(element('<UAvatar :alt="label" />'), 'alt')).toBe(true)
  })

  it('reads booleans in every spelling HTML allows', () => {
    expect(getStaticBoolean(element('<span hidden />'), 'hidden')).toBe(true)
    expect(getStaticBoolean(element('<span hidden="" />'), 'hidden')).toBe(true)
    expect(getStaticBoolean(element('<span hidden="true" />'), 'hidden')).toBe(true)
    expect(getStaticBoolean(element('<span hidden="false" />'), 'hidden')).toBe(false)
    expect(getStaticBoolean(element('<span :hidden="false" />'), 'hidden')).toBe(false)
    expect(getStaticBoolean(element('<span :hidden="flag" />'), 'hidden')).toBe(null)
    expect(getStaticBoolean(element('<span />'), 'hidden')).toBe(null)
  })

  it('returns a static string only when it really is one', () => {
    expect(getStaticAttribute(element('<input type="number">'), 'type')).toBe('number')
    expect(getStaticAttribute(element('<input :type="kind">'), 'type')).toBe(null)
    expect(getStaticAttribute(element('<input :type="\'number\'">'), 'type')).toBe('number')
  })
})

describe('slots', () => {
  const decorative = (node: VueAST.VElement) => node.rawName === 'UIcon'

  it('requires a declared slot to have content', () => {
    const withContent = element('<UTooltip><template #content>Hint</template></UTooltip>')
    expect(hasSlot(withContent, 'content')).toBe(true)

    const empty = element('<UTooltip><template #content></template></UTooltip>')
    expect(hasSlot(empty, 'content')).toBe(false)
  })

  it('accepts a dynamic slot name rather than guessing it is the wrong one', () => {
    expect(hasSlot(element('<UTooltip><template #[name]>Hint</template></UTooltip>'), 'content')).toBe(true)
    expect(hasSlot(element('<UTooltip><template #footer>Hint</template></UTooltip>'), 'content')).toBe(false)
  })

  it('ignores decorative and statically hidden slot content', () => {
    expect(hasSlot(element('<UButton><template #default><UIcon name="i-x" /></template></UButton>'), 'default', decorative)).toBe(false)
    expect(hasSlot(element('<UButton><template #default v-if="false">Save</template></UButton>'), 'default')).toBe(false)
  })
})

describe('hasLabelContent', () => {
  const decorative = (node: VueAST.VElement) => node.rawName === 'UIcon'

  it('counts text, interpolation and nested markup', () => {
    expect(hasLabelContent(element('<UButton>Save</UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton>{{ label }}</UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton><span><b>Save</b></span></UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton>   </UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton></UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton>{{ "" }}</UButton>'))).toBe(false)
  })

  it('counts an image with alt text but not a decorative one', () => {
    expect(hasLabelContent(element('<UButton><img src="/a.png" alt="Save"></UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton><img src="/a.png" alt=""></UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton><UIcon name="i-x" /></UButton>'), decorative)).toBe(false)
  })

  it('assumes an unknown component renders something, but looks through transparent built-ins', () => {
    expect(hasLabelContent(element('<UButton><MyLabel /></UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton><Transition></Transition></UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton><Transition>Save</Transition></UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton><KeepAlive><MyLabel /></KeepAlive></UButton>'))).toBe(true)
  })

  it('skips content hidden from the accessibility tree', () => {
    expect(hasLabelContent(element('<UButton><span aria-hidden="true">Save</span></UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton><span hidden>Save</span></UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton><span v-if="\'\'">Save</span></UButton>'))).toBe(false)
    expect(hasLabelContent(element('<UButton><span v-if="ready">Save</span></UButton>'))).toBe(true)
    expect(hasLabelContent(element('<UButton><span :aria-hidden="flag">Save</span></UButton>'))).toBe(true)
  })
})

describe('hasVModel', () => {
  it('distinguishes the default model from a named one', () => {
    expect(hasVModel(element('<UInput v-model="value" />'), null)).toBe(true)
    expect(hasVModel(element('<UInput v-model="value" />'), 'open')).toBe(false)
    expect(hasVModel(element('<UModal v-model:open="open" />'), 'open')).toBe(true)
    expect(hasVModel(element('<UModal v-model:open="open" />'), null)).toBe(false)
    expect(hasVModel(element('<UModal v-model:[name]="open" />'), 'open')).toBe(false)
    expect(hasVModel(element('<UModal :open="open" />'), 'open')).toBe(false)
  })
})

describe('hasDirective', () => {
  it('matches a directive by name, whatever its argument or value', () => {
    expect(hasDirective(element('<UInput v-if="ready" />'), 'if')).toBe(true)
    expect(hasDirective(element('<UInput v-else />'), 'else')).toBe(true)
    expect(hasDirective(element('<UModal v-model:open="open" />'), 'model')).toBe(true)
    expect(hasDirective(element('<UInput v-if="ready" />'), 'else-if')).toBe(false)
    expect(hasDirective(element('<UInput if="ready" />'), 'if')).toBe(false)
  })
})

describe('isStaticallyHidden', () => {
  it('reports only the elements provably absent from the accessibility tree', () => {
    expect(isStaticallyHidden(element('<span hidden>Save</span>'))).toBe(true)
    expect(isStaticallyHidden(element('<span aria-hidden="true">Save</span>'))).toBe(true)
    expect(isStaticallyHidden(element('<span v-if="false">Save</span>'))).toBe(true)
    expect(isStaticallyHidden(element('<span v-show="\'\'">Save</span>'))).toBe(true)
    expect(isStaticallyHidden(element('<span v-if="ready">Save</span>'))).toBe(false)
    expect(isStaticallyHidden(element('<span>Save</span>'))).toBe(false)
  })
})

describe('documentRoot', () => {
  it('climbs past the template element to the document fragment', () => {
    const root = documentRoot(element('<UForm><UInput /></UForm>'))
    expect(root?.type).toBe('VDocumentFragment')
  })
})

describe('findElement', () => {
  it('searches the whole tree from any node, including the root itself', () => {
    const form = element('<UForm><div><UInput id="email" /></div></UForm>')
    expect(findElement(form, node => node.rawName === 'UInput')?.rawName).toBe('UInput')
    expect(findElement(form, node => node.rawName === 'UForm')?.rawName).toBe('UForm')
    expect(findElement(form, node => node.rawName === 'UTextarea')).toBe(null)
    expect(findElement(null, () => true)).toBe(null)
  })

  it('reaches siblings of the starting element through the document root', () => {
    const label = element('<label for="email">Email</label><UInput id="email" />')
    expect(findElement(documentRoot(label), node => node.rawName === 'UInput')?.rawName).toBe('UInput')
  })
})
