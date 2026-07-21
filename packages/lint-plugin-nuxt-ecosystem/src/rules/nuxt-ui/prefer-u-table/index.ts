import { preferUComponent } from '../prefer-u-component.js'

export const preferUTable = preferUComponent({
  nativeTag: 'table',
  component: 'UTable',
  ruleName: 'prefer-u-table',
  messageId: 'preferUTable',
})
