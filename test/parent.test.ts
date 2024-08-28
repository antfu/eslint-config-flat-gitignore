import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in subfolder', () => {
  process.chdir('test')
  it('should properly work with parent dirs', () => {
    expect(ignore({ root: false }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "../.cache",
            "../**/.cache/**",
            "../.DS_Store",
            "../**/.DS_Store/**",
            "../.idea",
            "../**/.idea/**",
            "../*.log",
            "../**/*.log/**",
            "../*.tgz",
            "../**/*.tgz/**",
            "../coverage",
            "../**/coverage/**",
            "../dist",
            "../**/dist/**",
            "../lib-cov",
            "../**/lib-cov/**",
            "../logs",
            "../**/logs/**",
            "../node_modules",
            "../**/node_modules/**",
            "../temp",
            "../**/temp/**",
            "!../temp/.gitkeep",
            "!../temp/.gitkeep/**",
          ],
        }
      `)
  })
})
