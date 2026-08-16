import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { preferUTree } from './index.js'

describe('prefer-u-tree', () => {
  it('reports only explicit static tree roots', () => {
    tester.run('prefer-u-tree', preferUTree, {
      valid: [
        { code: '<template><UTree :items="items" /></template>' },
        {
          code: '<template><UTree role="tree" :items="items" /></template>',
        },
        { code: '<template><ul :role="role"><li /></ul></template>' },
        {
          code: '<template><ul :role="\'tree\'"><li /></ul></template>',
        },
        { code: '<template><ul role="treegrid"><li /></ul></template>' },
        {
          code: '<template><ul><TreeNode v-for="item in items" :item="item" /></ul></template>',
        },
      ],
      invalid: [
        {
          code: '<template><ul role="tree"><li role="treeitem" /></ul></template>',
          errors: [{ messageId: 'preferUTree' }],
        },
        {
          code: '<template><CustomTree role="tree" /></template>',
          errors: [{ messageId: 'preferUTree', data: { component: 'UTree' } }],
        },
        {
          code: '<template><ul role="tree"><li role="treeitem" /></ul></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' } },
          errors: [{ messageId: 'preferUTree', data: { component: 'NuTree' } }],
        },
      ],
    })
  })
})
