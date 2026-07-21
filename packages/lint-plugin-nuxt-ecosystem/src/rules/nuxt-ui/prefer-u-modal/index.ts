import { preferUComponent } from '../prefer-u-component.js'

export const preferUModal = preferUComponent({
  nativeTag: 'dialog',
  component: 'UModal',
  ruleName: 'prefer-u-modal',
  messageId: 'preferUModal',
})
