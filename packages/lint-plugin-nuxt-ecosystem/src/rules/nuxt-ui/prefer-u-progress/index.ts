import { preferUComponent } from '../prefer-u-component.js'

export const preferUProgress = preferUComponent({
  nativeTag: 'progress',
  component: 'UProgress',
  ruleName: 'prefer-u-progress',
  messageId: 'preferUProgress',
})
