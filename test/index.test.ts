import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should', () => {
  it('exported', () => {
    expect(ignore())
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
    expect(() => ignore({ files: 'not-exists' }))
      .toThrow()
  })

  it('not strict skip missing file', () => {
    expect(ignore({ files: 'not-exists', strict: false }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [],
        }
      `)
  })
})
