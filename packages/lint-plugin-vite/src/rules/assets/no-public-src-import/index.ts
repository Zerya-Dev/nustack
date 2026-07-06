import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'

export const noPublicSrcImport: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing assets from Vite public directories.',
      url: docsUrl('assets/no-public-src-import'),
    },
    schema: [],
    messages: {
      noPublicSrcImport: 'Files in `public/` are served as root URLs and are not transformed by Vite. Reference this asset by URL or move it into source assets before importing it.',
    },
  },
  createOnce(context: any) {
    function checkSource(node: any): void {
      const value = node.source?.value
      if (typeof value === 'string' && /(?:^|\/)public\//.test(value))
        context.report({ node: node.source, messageId: 'noPublicSrcImport' })
    }

    return {
      ImportDeclaration: checkSource,
      ExportNamedDeclaration: checkSource,
      ExportAllDeclaration: checkSource,
    }
  },
}
