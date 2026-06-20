import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-useevent-listener']

describe('prefer-useevent-listener', () => {
  it('reports global event listener APIs', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-useevent-listener', rule as never, {
      valid: [
        { code: "useEventListener(window, 'resize', onResize)" },
        { code: "el.addEventListener('click', onClick)" },
      ],
      invalid: [
        { code: "window.addEventListener('resize', onResize)", errors: [{ messageId: 'preferUseEventListener' }] },
        { code: "document.removeEventListener('click', onClick)", errors: [{ messageId: 'preferUseEventListener' }] },
      ],
    })
  })
})
