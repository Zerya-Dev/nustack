import { preferUComponent } from '../prefer-u-component.js'

export const preferUDialog = preferUComponent({
  nativeTag: 'dialog',
  component: 'UModal',
  ruleName: 'prefer-u-dialog',
  messageId: 'preferUDialog',
})
