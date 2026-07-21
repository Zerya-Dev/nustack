import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noConflictingStateProps as noConflictingStatePropsRule } from './rules/nuxt-ui/no-conflicting-state-props/index.js'
import { noDeprecatedComponents as noDeprecatedComponentsRule } from './rules/nuxt-ui/no-deprecated-components/index.js'
import { noDeprecatedModelModifiers as noDeprecatedModelModifiersRule } from './rules/nuxt-ui/no-deprecated-model-modifiers/index.js'
import { noInvalidIconName as noInvalidIconNameRule } from './rules/nuxt-ui/no-invalid-icon-name/index.js'
import { noInvalidPropCombinations as noInvalidPropCombinationsRule } from './rules/nuxt-ui/no-invalid-prop-combinations/index.js'
import { noInvalidPropValues as noInvalidPropValuesRule } from './rules/nuxt-ui/no-invalid-prop-values/index.js'
import { preferLinkTo as preferLinkToRule } from './rules/nuxt-ui/prefer-link-to/index.js'
import { preferOpenModel as preferOpenModelRule } from './rules/nuxt-ui/prefer-open-model/index.js'
import { preferSemanticColors as preferSemanticColorsRule } from './rules/nuxt-ui/prefer-semantic-colors/index.js'
import { preferUButton as preferUButtonRule } from './rules/nuxt-ui/prefer-u-button/index.js'
import { preferUDialog as preferUDialogRule } from './rules/nuxt-ui/prefer-u-dialog/index.js'
import { preferUFormControls as preferUFormControlsRule } from './rules/nuxt-ui/prefer-u-form-controls/index.js'
import { preferUIcon as preferUIconRule } from './rules/nuxt-ui/prefer-u-icon/index.js'
import { preferUKbd as preferUKbdRule } from './rules/nuxt-ui/prefer-u-kbd/index.js'
import { preferULink as preferULinkRule } from './rules/nuxt-ui/prefer-u-link/index.js'
import { preferUProgress as preferUProgressRule } from './rules/nuxt-ui/prefer-u-progress/index.js'
import { preferUSeparator as preferUSeparatorRule } from './rules/nuxt-ui/prefer-u-separator/index.js'
import { preferUTable as preferUTableRule } from './rules/nuxt-ui/prefer-u-table/index.js'
import { requireAvatarAlt as requireAvatarAltRule } from './rules/nuxt-ui/require-avatar-alt/index.js'
import { requireFormControlLabel as requireFormControlLabelRule } from './rules/nuxt-ui/require-form-control-label/index.js'
import { requireFormFieldName as requireFormFieldNameRule } from './rules/nuxt-ui/require-form-field-name/index.js'
import { requireFormState as requireFormStateRule } from './rules/nuxt-ui/require-form-state/index.js'
import { requireIconButtonLabel as requireIconButtonLabelRule } from './rules/nuxt-ui/require-icon-button-label/index.js'
import { requireOverlayTitle as requireOverlayTitleRule } from './rules/nuxt-ui/require-overlay-title/index.js'
import { requirePopoverContent as requirePopoverContentRule } from './rules/nuxt-ui/require-popover-content/index.js'
import { requireTooltipContent as requireTooltipContentRule } from './rules/nuxt-ui/require-tooltip-content/index.js'
import { requireUApp as requireUAppRule } from './rules/nuxt-ui/require-u-app/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/nuxt-ui',
  },
  rules: {
    'no-conflicting-state-props': noConflictingStatePropsRule,
    'no-deprecated-components': noDeprecatedComponentsRule,
    'no-deprecated-model-modifiers': noDeprecatedModelModifiersRule,
    'no-invalid-icon-name': noInvalidIconNameRule,
    'no-invalid-prop-combinations': noInvalidPropCombinationsRule,
    'no-invalid-prop-values': noInvalidPropValuesRule,
    'prefer-link-to': preferLinkToRule,
    'prefer-open-model': preferOpenModelRule,
    'prefer-semantic-colors': preferSemanticColorsRule,
    'prefer-u-button': preferUButtonRule,
    'prefer-u-dialog': preferUDialogRule,
    'prefer-u-form-controls': preferUFormControlsRule,
    'prefer-u-icon': preferUIconRule,
    'prefer-u-kbd': preferUKbdRule,
    'prefer-u-link': preferULinkRule,
    'prefer-u-progress': preferUProgressRule,
    'prefer-u-separator': preferUSeparatorRule,
    'prefer-u-table': preferUTableRule,
    'require-avatar-alt': requireAvatarAltRule,
    'require-form-control-label': requireFormControlLabelRule,
    'require-form-field-name': requireFormFieldNameRule,
    'require-form-state': requireFormStateRule,
    'require-icon-button-label': requireIconButtonLabelRule,
    'require-overlay-title': requireOverlayTitleRule,
    'require-popover-content': requirePopoverContentRule,
    'require-tooltip-content': requireTooltipContentRule,
    'require-u-app': requireUAppRule,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** The Nuxt UI pack, Vue-SFC-scoped, ready to spread into a flat config. */
    ui: Linter.Config[]
    /** Union of every ecosystem sub-pack shipped here (today: just Nuxt UI). */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/nuxt-ui': plugin }

export const NUXT_UI_GLOB = ['**/*.vue']

export interface NuxtUiConfigsOptions {
  /** Cumulative variant; `minimal` ships nothing, `recommended` (default) the rule set. */
  variant?: 'minimal' | 'recommended'
  /** Extra rule overrides, merged onto the Vue-SFC scope. */
  rules?: Linter.RulesRecord
}

/** Returns Vue-SFC-scoped Nuxt UI configs. */
export function nuxtUiConfigs(options: NuxtUiConfigsOptions = {}): Linter.Config[] {
  const { variant = 'recommended', rules } = options
  const configs: Linter.Config[] = []

  if (variant !== 'minimal') {
    configs.push({
      name: 'nustack/nuxt-ui',
      files: NUXT_UI_GLOB,
      plugins: pluginRef,
      rules: {
        '@nustack/nuxt-ui/no-conflicting-state-props': 'warn',
        '@nustack/nuxt-ui/no-deprecated-components': 'warn',
        '@nustack/nuxt-ui/no-deprecated-model-modifiers': 'warn',
        '@nustack/nuxt-ui/no-invalid-icon-name': 'warn',
        '@nustack/nuxt-ui/no-invalid-prop-combinations': 'warn',
        '@nustack/nuxt-ui/no-invalid-prop-values': 'warn',
        '@nustack/nuxt-ui/prefer-link-to': 'warn',
        '@nustack/nuxt-ui/prefer-open-model': 'warn',
        '@nustack/nuxt-ui/prefer-semantic-colors': 'warn',
        '@nustack/nuxt-ui/prefer-u-button': 'warn',
        '@nustack/nuxt-ui/prefer-u-dialog': 'warn',
        '@nustack/nuxt-ui/prefer-u-form-controls': 'warn',
        '@nustack/nuxt-ui/prefer-u-icon': 'warn',
        '@nustack/nuxt-ui/prefer-u-kbd': 'warn',
        '@nustack/nuxt-ui/prefer-u-link': 'warn',
        '@nustack/nuxt-ui/prefer-u-progress': 'warn',
        '@nustack/nuxt-ui/prefer-u-separator': 'warn',
        '@nustack/nuxt-ui/prefer-u-table': 'warn',
        '@nustack/nuxt-ui/require-avatar-alt': 'warn',
        '@nustack/nuxt-ui/require-form-control-label': 'warn',
        '@nustack/nuxt-ui/require-form-field-name': 'warn',
        '@nustack/nuxt-ui/require-form-state': 'warn',
        '@nustack/nuxt-ui/require-icon-button-label': 'warn',
        '@nustack/nuxt-ui/require-overlay-title': 'warn',
        '@nustack/nuxt-ui/require-popover-content': 'warn',
        '@nustack/nuxt-ui/require-tooltip-content': 'warn',
        '@nustack/nuxt-ui/require-u-app': 'warn',
      },
    })
  }

  if (rules && Object.keys(rules).length) {
    configs.push({
      name: 'nustack/nuxt-ui/rules',
      files: NUXT_UI_GLOB,
      plugins: pluginRef,
      rules,
    })
  }

  return configs
}

plugin.configs = {
  ui: nuxtUiConfigs(),
  // Union preset for every ecosystem sub-pack shipped by this package.
  recommended: nuxtUiConfigs(),
}

export const preferUButton: Rule.RuleModule = plugin.rules!['prefer-u-button'] as Rule.RuleModule
export const preferUFormControls: Rule.RuleModule = plugin.rules!['prefer-u-form-controls'] as Rule.RuleModule
export const preferULink: Rule.RuleModule = plugin.rules!['prefer-u-link'] as Rule.RuleModule
export const preferUTable: Rule.RuleModule = plugin.rules!['prefer-u-table'] as Rule.RuleModule
export const noDeprecatedComponents: Rule.RuleModule = plugin.rules!['no-deprecated-components'] as Rule.RuleModule
export const noDeprecatedModelModifiers: Rule.RuleModule = plugin.rules!['no-deprecated-model-modifiers'] as Rule.RuleModule
export const noConflictingStateProps: Rule.RuleModule = plugin.rules!['no-conflicting-state-props'] as Rule.RuleModule
export const noInvalidIconName: Rule.RuleModule = plugin.rules!['no-invalid-icon-name'] as Rule.RuleModule
export const noInvalidPropCombinations: Rule.RuleModule = plugin.rules!['no-invalid-prop-combinations'] as Rule.RuleModule
export const noInvalidPropValues: Rule.RuleModule = plugin.rules!['no-invalid-prop-values'] as Rule.RuleModule
export const preferLinkTo: Rule.RuleModule = plugin.rules!['prefer-link-to'] as Rule.RuleModule
export const preferOpenModel: Rule.RuleModule = plugin.rules!['prefer-open-model'] as Rule.RuleModule
export const preferSemanticColors: Rule.RuleModule = plugin.rules!['prefer-semantic-colors'] as Rule.RuleModule
export const preferUIcon: Rule.RuleModule = plugin.rules!['prefer-u-icon'] as Rule.RuleModule
export const preferUDialog: Rule.RuleModule = plugin.rules!['prefer-u-dialog'] as Rule.RuleModule
export const preferUKbd: Rule.RuleModule = plugin.rules!['prefer-u-kbd'] as Rule.RuleModule
export const preferUProgress: Rule.RuleModule = plugin.rules!['prefer-u-progress'] as Rule.RuleModule
export const preferUSeparator: Rule.RuleModule = plugin.rules!['prefer-u-separator'] as Rule.RuleModule
export const requirePopoverContent: Rule.RuleModule = plugin.rules!['require-popover-content'] as Rule.RuleModule
export const requireFormControlLabel: Rule.RuleModule = plugin.rules!['require-form-control-label'] as Rule.RuleModule
export const requireUApp: Rule.RuleModule = plugin.rules!['require-u-app'] as Rule.RuleModule
export const requireAvatarAlt: Rule.RuleModule = plugin.rules!['require-avatar-alt'] as Rule.RuleModule
export const requireFormFieldName: Rule.RuleModule = plugin.rules!['require-form-field-name'] as Rule.RuleModule
export const requireFormState: Rule.RuleModule = plugin.rules!['require-form-state'] as Rule.RuleModule
export const requireIconButtonLabel: Rule.RuleModule = plugin.rules!['require-icon-button-label'] as Rule.RuleModule
export const requireOverlayTitle: Rule.RuleModule = plugin.rules!['require-overlay-title'] as Rule.RuleModule
export const requireTooltipContent: Rule.RuleModule = plugin.rules!['require-tooltip-content'] as Rule.RuleModule
export default plugin
