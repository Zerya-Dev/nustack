/**
 * Shape of the project context that the Nuxt module resolves at `nuxt prepare`
 * time and serializes into `.nuxt/nustack-eslint.mjs`. The ESLint config factory
 * (`nustack`) reads this back to decide which rule packs to activate, so the
 * lint config always matches what the project actually uses — zero config.
 */
export interface NustackContext {
  /** Detected Nuxt modules that have a dedicated rule pack. */
  modules: {
    /** `@nuxt/ui` — activates the Tailwind + Nuxt UI pack. */
    nuxtUi: boolean
    /** `@pinia/nuxt` — reserved for a future pack. */
    pinia: boolean
    /** `@nuxt/image` — contributes auto-imported components. */
    nuxtImage: boolean
    /** `@nuxt/content` — reserved for a future pack. */
    nuxtContent: boolean
    /** MDC-capable Markdown renderer (`@nuxt/content`, `@comark/nuxt`, or legacy `@nuxtjs/mdc`). */
    mdc: boolean
  }
  tailwind: {
    /** Whether a Tailwind v4 CSS entry point was found. */
    detected: boolean
    /**
     * Path to the CSS file that imports Tailwind (`@import "tailwindcss"`),
     * relative to the project root. `null` when not detected.
     */
    entryPoint: string | null
  }
  /**
   * Every identifier Nuxt makes globally available without an explicit import,
   * pulled from the resolved unimport registry (Vue reactivity, Nuxt
   * composables, project `composables/` + `utils/`, module-provided helpers).
   */
  autoImports: string[]
  /** Globally registered component names (Nuxt built-ins + project + modules). */
  components: string[]
}

/** A safe, empty context used as a fallback when the generated file is absent. */
export const EMPTY_CONTEXT: NustackContext = {
  modules: { nuxtUi: false, pinia: false, nuxtImage: false, nuxtContent: false, mdc: false },
  tailwind: { detected: false, entryPoint: null },
  autoImports: [],
  components: [],
}
