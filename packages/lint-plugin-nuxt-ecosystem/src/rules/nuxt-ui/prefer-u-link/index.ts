import { preferUComponent } from '../prefer-u-component.js'

export const preferULink = preferUComponent({
  nativeTag: 'a',
  component: 'Link',
  ruleName: 'prefer-u-link',
  messageId: 'preferULink',
})
