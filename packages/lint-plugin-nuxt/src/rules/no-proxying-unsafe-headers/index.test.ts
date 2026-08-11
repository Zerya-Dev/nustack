import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-proxying-unsafe-headers']

describe('no-proxying-unsafe-headers', () => {
  it('reports unsafe headers passed to useRequestHeaders', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('no-proxying-unsafe-headers', rule as never, {
      valid: [
        { code: 'useRequestHeaders([\'cookie\', \'authorization\'])' },
        { code: 'useRequestHeaders()' },
        { code: 'useRequestHeaders(headers)' },
        { code: 'useRequestHeaders([headerName])' },
        { code: 'api.useRequestHeaders([\'host\'])' },
        { code: 'anotherFunction([\'host\'])' },
      ],
      invalid: [
        {
          code: 'useRequestHeaders([\'host\', \'accept\', \'content-length\', \'content-md5\', \'content-type\', \'x-forwarded-host\', \'x-forwarded-port\', \'x-forwarded-proto\', \'cf-connecting-ip\', \'cf-ray\'])',
          errors: [
            { messageId: 'unsafeHeader', data: { header: 'host' } },
            { messageId: 'unsafeHeader', data: { header: 'accept' } },
            { messageId: 'unsafeHeader', data: { header: 'content-length' } },
            { messageId: 'unsafeHeader', data: { header: 'content-md5' } },
            { messageId: 'unsafeHeader', data: { header: 'content-type' } },
            { messageId: 'unsafeHeader', data: { header: 'x-forwarded-host' } },
            { messageId: 'unsafeHeader', data: { header: 'x-forwarded-port' } },
            { messageId: 'unsafeHeader', data: { header: 'x-forwarded-proto' } },
            { messageId: 'unsafeHeader', data: { header: 'cf-connecting-ip' } },
            { messageId: 'unsafeHeader', data: { header: 'cf-ray' } },
          ],
        },
        {
          code: 'useRequestHeaders([\'cookie\', \'Content-Type\', `CF-RAY`])',
          errors: [
            { messageId: 'unsafeHeader', data: { header: 'Content-Type' } },
            { messageId: 'unsafeHeader', data: { header: 'CF-RAY' } },
          ],
        },
      ],
    })
  })
})
