import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in test/workspace-with-info-exclude', () => {
  process.chdir('test/workspace-with-info-exclude')

  it('default: reads both .gitignore and .git/info/exclude, all root-level', () => {
    expect(ignore())
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "**/*.tmp",
            "**/*.log",
          ],
          "name": "gitignore",
        }
      `)
  })

  it('explicit files: only the listed files are read (.gitignore only here)', () => {
    expect(ignore({ files: ['.gitignore'] }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "**/*.log",
          ],
          "name": "gitignore",
        }
      `)
  })

  it('explicit files including .git/info/exclude gets the .git/info/ dir prefix (nested-file semantics)', () => {
    // Explicit entries go through the same nested-file loop, so `.git/info/`
    // becomes the pattern prefix — unlike the default path which root-scopes.
    expect(ignore({ files: ['.gitignore', '.git/info/exclude'] }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "**/*.log",
            ".git/info/**/*.tmp",
          ],
          "name": "gitignore",
        }
      `)
  })

  it('strict: throws when no .gitignore exists', () => {
    expect(() => ignore({ files: 'not-exists' }))
      .toThrow()
  })
})
