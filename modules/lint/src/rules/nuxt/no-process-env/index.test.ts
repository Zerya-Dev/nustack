import { describe, js } from '../../rule-tester'
import { rule as noProcessEnv } from './index'

describe('nuxt/no-process-env', () => {
  js.run('nuxt/no-process-env', noProcessEnv, {
    valid: [
      `const x = import.meta.env.FOO`,
      `process.cwd()`,
    ],
    invalid: [
      { code: `const x = process.env.FOO`, errors: [{ messageId: 'noProcessEnv' }] },
      { code: `const { A } = process.env`, errors: [{ messageId: 'noProcessEnv' }] },
    ],
  })
})
