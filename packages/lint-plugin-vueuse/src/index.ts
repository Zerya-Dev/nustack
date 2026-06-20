import type { ESLint, Linter } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noNuxtAutoImportCollision } from './rules/no-nuxt-auto-import-collision/index.js'
import { noNamespaceImport } from './rules/no-namespace-import/index.js'
import { preferUseObservers } from './rules/prefer-use-observers/index.js'
import { preferUseStorage } from './rules/prefer-use-storage/index.js'
import { preferUseTimers } from './rules/prefer-use-timers/index.js'
import { preferUseEventListener } from './rules/prefer-useevent-listener/index.js'
import { preferUseClipboard } from './rules/prefer-useclipboard/index.js'
import { preferUseWindowSize } from './rules/prefer-usewindow-size/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustackjs/lint-plugin-vueuse',
  },
  rules: {
    'no-nuxt-auto-import-collision': noNuxtAutoImportCollision,
    'no-namespace-import': noNamespaceImport,
    'prefer-use-observers': preferUseObservers,
    'prefer-use-storage': preferUseStorage,
    'prefer-use-timers': preferUseTimers,
    'prefer-useclipboard': preferUseClipboard,
    'prefer-useevent-listener': preferUseEventListener,
    'prefer-usewindow-size': preferUseWindowSize,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    recommended: Linter.Config
  }
}

plugin.configs = {
  recommended: {
    plugins: {
      vueuse: plugin,
    },
    rules: {
      'vueuse/no-nuxt-auto-import-collision': 'warn',
      'vueuse/no-namespace-import': 'warn',
      'vueuse/prefer-use-observers': 'warn',
      'vueuse/prefer-use-storage': 'warn',
      'vueuse/prefer-use-timers': 'warn',
      'vueuse/prefer-useclipboard': 'warn',
      'vueuse/prefer-useevent-listener': 'warn',
      'vueuse/prefer-usewindow-size': 'warn',
    },
  },
}

export {
  noNuxtAutoImportCollision,
  noNamespaceImport,
  preferUseClipboard,
  preferUseEventListener,
  preferUseObservers,
  preferUseStorage,
  preferUseTimers,
  preferUseWindowSize,
}
export default plugin
