import type { Plugin } from '@oxlint/plugins'
import type { ESLint, Linter } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { nuxtUiSettings } from './components.js'
import { noConflictingStateProps } from './no-conflicting-state-props/index.js'
import { noDeprecatedComponents } from './no-deprecated-components/index.js'
import { noDeprecatedModelModifiers } from './no-deprecated-model-modifiers/index.js'
import { noInvalidPropCombinations } from './no-invalid-prop-combinations/index.js'
import { preferLinkTo } from './prefer-link-to/index.js'
import { preferUButton } from './prefer-u-button/index.js'
import { preferUFormControls } from './prefer-u-form-controls/index.js'
import { preferUFormField } from './prefer-u-form-field/index.js'
import { preferUIcon } from './prefer-u-icon/index.js'
import { preferUKbd } from './prefer-u-kbd/index.js'
import { preferULink } from './prefer-u-link/index.js'
import { preferUModal } from './prefer-u-modal/index.js'
import { preferUProgress } from './prefer-u-progress/index.js'
import { preferUSeparator } from './prefer-u-separator/index.js'
import { preferUTable } from './prefer-u-table/index.js'
import { preferUTree } from './prefer-u-tree/index.js'
import { requireAvatarAlt } from './require-avatar-alt/index.js'
import { requireFormControlLabel } from './require-form-control-label/index.js'
import { requireFormFieldName } from './require-form-field-name/index.js'
import { requireIconButtonLabel } from './require-icon-button-label/index.js'
import { requireNestedFormProp } from './require-nested-form-prop/index.js'
import { requireOverlayTitle } from './require-overlay-title/index.js'
import { requirePopoverContent } from './require-popover-content/index.js'
import { requireTooltipContent } from './require-tooltip-content/index.js'
import { requireUApp } from './require-u-app/index.js'

export const nuxtUiPlugin = eslintCompatPlugin({
  meta: {
    name: '@nustackjs/lint-plugin-nuxt-ecosystem/nuxt-ui',
  },
  rules: {
    'no-conflicting-state-props': noConflictingStateProps,
    'no-deprecated-components': noDeprecatedComponents,
    'no-deprecated-model-modifiers': noDeprecatedModelModifiers,
    'no-invalid-prop-combinations': noInvalidPropCombinations,
    'prefer-link-to': preferLinkTo,
    'prefer-u-button': preferUButton,
    'prefer-u-form-controls': preferUFormControls,
    'prefer-u-form-field': preferUFormField,
    'prefer-u-icon': preferUIcon,
    'prefer-u-kbd': preferUKbd,
    'prefer-u-link': preferULink,
    'prefer-u-modal': preferUModal,
    'prefer-u-progress': preferUProgress,
    'prefer-u-separator': preferUSeparator,
    'prefer-u-table': preferUTable,
    'prefer-u-tree': preferUTree,
    'require-avatar-alt': requireAvatarAlt,
    'require-form-control-label': requireFormControlLabel,
    'require-form-field-name': requireFormFieldName,
    'require-icon-button-label': requireIconButtonLabel,
    'require-nested-form-prop': requireNestedFormProp,
    'require-overlay-title': requireOverlayTitle,
    'require-popover-content': requirePopoverContent,
    'require-tooltip-content': requireTooltipContent,
    'require-u-app': requireUApp,
  },
}) as Plugin & ESLint.Plugin

export type NuxtUiPreset = 'minimal' | 'recommended'
export interface NuxtUiRulesOptions {
  preset?: NuxtUiPreset | false
  rules?: Linter.RulesRecord
}
export interface NuxtUiConfigOptions extends NuxtUiRulesOptions {
  prefix?: string
}

const NUXT_UI_MINIMAL_RULES = {
  'no-conflicting-state-props': 'error',
  'no-invalid-prop-combinations': 'error',
  'require-avatar-alt': 'error',
  'require-form-control-label': 'error',
  'require-form-field-name': 'error',
  'require-icon-button-label': 'error',
  'require-nested-form-prop': 'error',
  'require-overlay-title': 'error',
  'require-popover-content': 'error',
  'require-tooltip-content': 'error',
  'require-u-app': 'error',
  'no-deprecated-components': 'error',
  'no-deprecated-model-modifiers': 'error',
} as const satisfies Record<string, 'error'>

const NUXT_UI_CONVENTION_RULES = {
  'prefer-link-to': 'warn',
  'prefer-u-button': 'warn',
  'prefer-u-form-controls': 'warn',
  'prefer-u-form-field': 'warn',
  'prefer-u-icon': 'warn',
  'prefer-u-kbd': 'warn',
  'prefer-u-link': 'warn',
  'prefer-u-modal': 'warn',
  'prefer-u-progress': 'warn',
  'prefer-u-separator': 'warn',
  'prefer-u-table': 'warn',
  'prefer-u-tree': 'warn',
} as const satisfies Record<string, 'warn'>

export const NUXT_UI_PRESET_RULES = {
  minimal: NUXT_UI_MINIMAL_RULES,
  recommended: { ...NUXT_UI_MINIMAL_RULES, ...NUXT_UI_CONVENTION_RULES },
} as const

export const nuxtUiPlugins: Record<string, ESLint.Plugin> = { '@nustack/nuxt-ui': nuxtUiPlugin }

export function nuxtUiRules(options: NuxtUiRulesOptions = {}): Linter.RulesRecord {
  const { preset = 'recommended', rules = {} } = options
  const configured = preset === false
    ? {}
    : Object.fromEntries(Object.entries(NUXT_UI_PRESET_RULES[preset]).map(([name, level]) => [`@nustack/nuxt-ui/${name}`, level]))
  return { ...configured, ...rules }
}

export function nuxtUiConfig(options: NuxtUiConfigOptions = {}): Linter.Config {
  const { prefix = 'U', ...rulesOptions } = options
  return {
    name: 'nustack/nuxt-ui',
    files: ['**/*.vue'],
    plugins: nuxtUiPlugins,
    rules: nuxtUiRules(rulesOptions),
    settings: nuxtUiSettings(prefix),
  }
}
