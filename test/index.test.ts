import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in root folder', () => {
  it('should find a gitignore file', () => {
    expect(ignore({ root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "**/.cache",
            "**/.DS_Store",
            "**/.idea",
            "**/*.log",
            "**/*.tgz",
            "**/coverage",
            "**/dist",
            "**/lib-cov",
            "**/logs",
            "**/node_modules",
            "**/temp",
            "!temp/.gitkeep",
            "test/.out",
            "!test/.in",
            "test/dir/file1",
            "!test/dir/file2",
            "**/test/dir/file3",
          ],
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
        }
      `)
  })
})
