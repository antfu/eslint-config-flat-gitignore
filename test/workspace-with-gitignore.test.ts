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
        }
      `)
  })

  it('strict (default) throw', () => {
    expect(() => ignore({ files: 'not-exists', fallbackToRoot: false }))
      .toThrow()
  })

  it('not strict skip missing file', () => {
    expect(ignore({ files: 'not-exists', strict: false, fallbackToRoot: false }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [],
        }
      `)
  })

  it('should find a gitignore file in cwd', () => {
    expect(ignore({ fallbackToRoot: false }))
      .toMatchInlineSnapshot(`
    {
      "ignores": [
        "gitignoretest",
        "**/gitignoretest/**",
      ],
    }
  `)
  })

  it('dont fallback to root, strict and return empty array', () => {
    expect(ignore({ strict: false, fallbackToRoot: false }))
      .toMatchInlineSnapshot(`
    {
      "ignores": [
        "gitignoretest",
        "**/gitignoretest/**",
      ],
    }
  `)
  })
})
