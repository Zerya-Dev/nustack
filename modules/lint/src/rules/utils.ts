import type { Rule } from 'eslint'
import { ESLintUtils } from '@typescript-eslint/utils'

/**
 * Factory for nustack rules, mirroring the `@nuxt/eslint-plugin` pattern. The
 * returned value is cast to `Rule.RuleModule` so rules slot into a flat config
 * `plugins` map without leaking `@typescript-eslint` types to the call site.
 */
export function createRule<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(
  rule: Readonly<ESLintUtils.RuleWithMetaAndName<TOptions, TMessageIds>>,
): Rule.RuleModule {
  const _createRule = ESLintUtils.RuleCreator(
    name => `https://github.com/nustackjs/nustack/blob/main/modules/lint/src/rules/${name}/index.md`,
  )
  return _createRule(rule) as unknown as Rule.RuleModule
}
