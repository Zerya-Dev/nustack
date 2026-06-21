// @nustackjs/lint dogfoods the same public factory it exposes to consumers,
// minus Nuxt-specific concerns. Imported from `src` so linting tracks source.
import nustack from './src/config'

export default nustack({
  base: {
    type: 'lib',
    // The playground is its own workspace package and lints itself via the Nuxt path.
    ignores: ['dist', 'playground'],
  },
})
