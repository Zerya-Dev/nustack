import { preferUComponent } from '../prefer-u-component.js'

export const preferUSeparator = preferUComponent({
  nativeTag: 'hr',
  component: 'USeparator',
  ruleName: 'prefer-u-separator',
  messageId: 'preferUSeparator',
})
