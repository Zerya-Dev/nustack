import { preferUComponent } from '../prefer-u-component.js'

export const preferUKbd = preferUComponent({
  nativeTag: 'kbd',
  component: 'UKbd',
  ruleName: 'prefer-u-kbd',
  messageId: 'preferUKbd',
})
