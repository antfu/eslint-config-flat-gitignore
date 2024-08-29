import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in subfolder', () => {
  process.chdir('test')
  it('should properly work with parent dirs', () => {
    expect(ignore({ root: false }))
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
            ".out",
            "!.in",
            "dir/file1",
            "!dir/file2",
            "**/test/dir/file3",
          ],
          "name": "gitignore",
        }
      `)
  })
})
