import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in test/workspace-with-gitignore', () => {
  process.chdir('test/workspace-with-gitignore')

  it('should find a gitignore file', () => {
    expect(ignore())
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "gitignoretest",
            "**/gitignoretest/**",
          ],
          "name": "gitignore",
        }
      `)
  })

  it('strict (default) throw', () => {
    expect(() => ignore({ files: 'not-exists', root: true }))
      .toThrow()
  })

  it('not strict skip missing file', () => {
    expect(ignore({ files: 'not-exists', strict: false, root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [],
          "name": "gitignore",
        }
      `)
  })

  it('should find a gitignore file in cwd', () => {
    expect(ignore({ root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "gitignoretest",
            "**/gitignoretest/**",
          ],
          "name": "gitignore",
        }
      `)
  })

  it('dont fallback to root, strict and return empty array', () => {
    expect(ignore({ strict: false, root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "gitignoretest",
            "**/gitignoretest/**",
          ],
          "name": "gitignore",
        }
      `)
  })
})
