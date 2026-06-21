import * as VueUse from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const viewport = VueUse.useWindowSize()

export function vueuseDemo() {
  const value = useStorage('nustack-playground', 0)

  return {
    value,
    viewport,
  }
}
