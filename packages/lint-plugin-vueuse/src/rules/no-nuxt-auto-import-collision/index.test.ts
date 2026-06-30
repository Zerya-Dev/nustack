import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-nuxt-auto-import-collision']

describe('no-nuxt-auto-import-collision', () => {
  it('reports unaliased colliding VueUse imports', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('no-nuxt-auto-import-collision', rule as never, {
      valid: [
        { code: 'import { useFetch as vueuseUseFetch } from \'@vueuse/core\'' },
        { code: 'import { useMouse } from \'@vueuse/core\'' },
        { code: 'import { useImage } from \'@vueuse/core\'', options: [{ ignoreNames: ['useImage'] }] },
      ],
      invalid: [
        { code: 'import { useFetch } from \'@vueuse/core\'', errors: [{ messageId: 'noCollision' }] },
        { code: 'import { useStorage } from \'@vueuse/core\'', errors: [{ messageId: 'noCollision' }] },
        {
          code: 'import { useI18n } from \'@vueuse/core\'',
          options: [{ additionalNames: ['useI18n'] }],
          errors: [{ messageId: 'noCollision' }],
        },
      ],
    })
  })
})
