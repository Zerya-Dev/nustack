// `computed` is auto-imported by Nuxt → nustack/no-explicit-auto-import flags
// (and auto-fixes) this redundant import.

export function double(value: number) {
  return computed(() => value * 2)
}
