import { preferUComponent } from '../prefer-u-component.js'

export const preferUTable = preferUComponent({
  nativeTag: 'table',
  component: 'Table',
  ruleName: 'prefer-u-table',
  messageId: 'preferUTable',
})
