import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../../index.js'

const rule = plugin.rules?.['no-client-secret-pattern']

describe('env/no-client-secret-pattern', () => {
  it('reports secret-looking VITE env names', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('env/no-client-secret-pattern', rule as never, {
      valid: [
        { code: 'const apiBase = import.meta.env.VITE_API_BASE' },
        { code: 'const token = process.env.API_TOKEN' },
        { code: 'const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY' },
        { code: 'const key = import.meta.env.VITE_VAPID_PUBLIC_KEY' },
        { code: 'const key = import.meta.env.VITE_TURNSTILE_SITE_KEY' },
        { code: 'const key = import.meta.env.VITE_API_KEY' },
        { code: 'const url = import.meta.env.VITE_DONKEY_URL' },
      ],
      invalid: [
        { code: 'const token = import.meta.env.VITE_API_TOKEN', errors: [{ messageId: 'noClientSecretPattern' }] },
        { code: 'const secret = import.meta.env[\'VITE_CLIENT_SECRET\']', errors: [{ messageId: 'noClientSecretPattern' }] },
        { code: 'const key = import.meta.env.VITE_PRIVATE_KEY', errors: [{ messageId: 'noClientSecretPattern' }] },
      ],
    })
  })
})
