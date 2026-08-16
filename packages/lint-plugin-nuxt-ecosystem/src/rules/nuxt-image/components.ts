import type { Context } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../utils/component-matcher.js'
import { createComponentMatcher } from '../../utils/component-matcher.js'
import { hasNuxtUi, NUXT_UI_MODULE, nuxtUiPrefix } from '../nuxt-ui/components.js'

const NUXT_IMAGE_MODULE = /^(?:@nuxt\/image(?:\/|$)|#components$)/

const PROSE_PREFIX = 'Prose'

export interface ImageTarget {
  name: string
  sources: readonly string[]
}

const IMAGE_COMPONENTS: Record<string, readonly string[]> = {
  NuxtImg: ['src'],
  NuxtPicture: ['src'],
}

// These wrappers resolve to `NuxtImg` and forward its image attributes.
const NUXT_UI_IMAGE_COMPONENTS: Record<string, readonly string[]> = {
  ColorModeImage: ['light', 'dark'],
}

const PROSE_IMAGE_COMPONENTS: Record<string, readonly string[]> = {
  Img: ['src'],
}

export interface ImageMatcher {
  match: (node: VueAST.VElement) => ImageTarget | null
}

function targetOf(matcher: ComponentMatcher, node: VueAST.VElement, components: Record<string, readonly string[]>): ImageTarget | null {
  const match = matcher.matchOf(node, Object.keys(components))
  return match === null ? null : { name: matcher.rawName(node), sources: components[match]! }
}

export function createNuxtImageMatcher(context: Context): ComponentMatcher {
  return createComponentMatcher(context, { module: NUXT_IMAGE_MODULE, prefix: '' })
}

export function createImageMatcher(context: Context): ImageMatcher {
  const image = createNuxtImageMatcher(context)
  const nuxtUi = hasNuxtUi(context)
    ? createComponentMatcher(context, { module: NUXT_UI_MODULE, prefix: nuxtUiPrefix(context) })
    : null
  const prose = hasNuxtUi(context)
    ? createComponentMatcher(context, { module: NUXT_UI_MODULE, prefix: PROSE_PREFIX })
    : null

  return {
    match: node => targetOf(image, node, IMAGE_COMPONENTS)
      ?? (nuxtUi && targetOf(nuxtUi, node, NUXT_UI_IMAGE_COMPONENTS))
      ?? (prose && targetOf(prose, node, PROSE_IMAGE_COMPONENTS)),
  }
}
