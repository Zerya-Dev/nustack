import { preferUComponent } from '../prefer-u-component.js'

export const preferUSeparator = preferUComponent({
  nativeTag: 'hr',
  component: 'Separator',
  ruleName: 'prefer-u-separator',
  messageId: 'preferUSeparator',
})
