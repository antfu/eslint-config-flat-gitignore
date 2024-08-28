import { describe, expect, it } from 'vitest'
import ignore from '../src/index'

describe('should execute tests in test/workspace-with-gitignore', () => {
  process.chdir('test/workspace-with-gitignore')

  it('should find a gitignore file', () => {
    expect(ignore())
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "rootfile",
            "rootfile/**",
            "rootdir/",
            "rootdir/**/",
            "rootpath",
            "**/rootpath/**",
            "rootfolder/file",
            "rootfolder/file/**",
            "rootfolder/dir/",
            "rootfolder/dir/**/",
            "rootfolder/path",
            "rootfolder/path/**",
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

  it('should find a gitignore file in cwd', () => {
    expect(ignore({ root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "rootfile",
            "rootfile/**",
            "rootdir/",
            "rootdir/**/",
            "rootpath",
            "**/rootpath/**",
            "rootfolder/file",
            "rootfolder/file/**",
            "rootfolder/dir/",
            "rootfolder/dir/**/",
            "rootfolder/path",
            "rootfolder/path/**",
          ],
        }
      `)
  })

  it('dont fallback to root, strict and return empty array', () => {
    expect(ignore({ strict: false, root: true }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "rootfile",
            "rootfile/**",
            "rootdir/",
            "rootdir/**/",
            "rootpath",
            "**/rootpath/**",
            "rootfolder/file",
            "rootfolder/file/**",
            "rootfolder/dir/",
            "rootfolder/dir/**/",
            "rootfolder/path",
            "rootfolder/path/**",
          ],
        }
      `)
  })

  it('should work properly with nested gitignore', () => {
    /**
     * https://git-scm.com/docs/gitignore#_pattern_format
     * If there is a separator at the beginning or middle (or both) of the pattern,
     * then the pattern is relative to the directory level of the particular .gitignore file itself.
     * Otherwise the pattern may also match at any level below the .gitignore level.
     *
     * If there is a separator at the end of the pattern then the pattern will only match directories,
     * otherwise the pattern can match both files and directories.
     */
    expect(ignore({ files: ['.gitignore', 'folder/.gitignore'] }))
      .toMatchInlineSnapshot(`
        {
          "ignores": [
            "rootfile",
            "rootfile/**",
            "rootdir/",
            "rootdir/**/",
            "rootpath",
            "**/rootpath/**",
            "rootfolder/file",
            "rootfolder/file/**",
            "rootfolder/dir/",
            "rootfolder/dir/**/",
            "rootfolder/path",
            "rootfolder/path/**",
            "folder/file",
            "folder/file/**",
            "folder/dir/",
            "folder/dir/**/",
            "folder/path",
            "folder/**/path/**",
          ],
        }
      `)
  })
})
