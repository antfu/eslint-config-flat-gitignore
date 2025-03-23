import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in test/system-with-uncle-gitignore', () => {
  process.chdir('test/system-with-uncle-gitignore/workspace')

  it('allows referencing files which are neither descendents nor ancestors', () => {
    expect(ignore({ files: ['../configs/.gitignore_global'] }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "**/globalignore",
          ],
          "name": "gitignore",
        }
      `)
  })
})
