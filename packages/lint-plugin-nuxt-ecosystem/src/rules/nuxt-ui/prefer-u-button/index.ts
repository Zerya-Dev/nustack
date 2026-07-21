import { preferUComponent } from '../prefer-u-component.js'

export const preferUButton = preferUComponent({
  nativeTag: 'button',
  component: 'UButton',
  ruleName: 'prefer-u-button',
  messageId: 'preferUButton',
})
