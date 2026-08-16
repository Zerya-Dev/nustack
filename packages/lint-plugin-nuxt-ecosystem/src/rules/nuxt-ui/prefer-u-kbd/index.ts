import { preferUComponent } from '../prefer-u-component.js'

export const preferUKbd = preferUComponent({
  nativeTag: 'kbd',
  component: 'Kbd',
  ruleName: 'prefer-u-kbd',
  messageId: 'preferUKbd',
})
