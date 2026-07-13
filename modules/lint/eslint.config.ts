// @nustackjs/lint dogfoods the same public factory it exposes to consumers,
// minus Nuxt-specific concerns. Imported from `src` so linting tracks source.
import nustack from './src/config'

export default nustack({
  target: 'nuxt-module',
  base: {
    ignores: ['dist', 'test/fixtures/**'],
  },
})
