import { defineBuildConfig } from 'unbuild'

// `nuxt-module-build` hardcodes the `src/module` + `src/runtime/` entries and
// passes them to unbuild as overrides. unbuild still loads this file and
// defu-concatenates the `entries` arrays, so declaring the config-factory entry
// here gets it built alongside the module (deps stay external by default).
export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'node16',
  clean: false,
  externals: [
    '@nuxt/schema',
    '@nuxt/kit',
    'eslint',
  ],
})
