import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in test/workspace-without-gitignore', () => {
  process.chdir('test/workspace-without-gitignore')

  it('should find a gitignore file', () => {
    expect(ignore())
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "../../.cache",
            "../../**/.cache/**",
            "../../.DS_Store",
            "../../**/.DS_Store/**",
            "../../.idea",
            "../../**/.idea/**",
            "../../*.log",
            "../../**/*.log/**",
            "../../*.tgz",
            "../../**/*.tgz/**",
            "../../coverage",
            "../../**/coverage/**",
            "../../dist",
            "../../**/dist/**",
            "../../lib-cov",
            "../../**/lib-cov/**",
            "../../logs",
            "../../**/logs/**",
            "../../node_modules",
            "../../**/node_modules/**",
            "../../temp",
            "../../**/temp/**",
            "!../../temp/.gitkeep",
            "!../../temp/.gitkeep/**",
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

  it('dont fallback to root, strict and throw error', () => {
    expect(() => ignore({ root: true }))
      .toThrow()
  })

  it('dont fallback to root, no strict and return empty array', () => {
    expect(ignore({ strict: false, root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [],
        }
      `)
  })
})
