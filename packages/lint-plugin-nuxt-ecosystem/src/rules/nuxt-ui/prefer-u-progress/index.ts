import { preferUComponent } from '../prefer-u-component.js'

export const preferUProgress = preferUComponent({
  nativeTag: 'progress',
  component: 'Progress',
  ruleName: 'prefer-u-progress',
  messageId: 'preferUProgress',
})
