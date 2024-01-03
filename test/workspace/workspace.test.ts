import { describe, expect, it } from 'vitest'
import ignore from '../../src/index'

describe('should', () => {
  process.chdir('test/workspace')

  it('exported', () => {
    expect(ignore({ fallbackToRoot: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            ".cache",
            "**/.cache/**",
            ".DS_Store",
            "**/.DS_Store/**",
            ".idea",
            "**/.idea/**",
            "*.log",
            "**/*.log/**",
            "*.tgz",
            "**/*.tgz/**",
            "coverage",
            "**/coverage/**",
            "dist",
            "**/dist/**",
            "lib-cov",
            "**/lib-cov/**",
            "logs",
            "**/logs/**",
            "node_modules",
            "**/node_modules/**",
            "temp",
            "**/temp/**",
            "!temp/.gitkeep",
            "!temp/.gitkeep/**",
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
})
