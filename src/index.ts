import fs from 'node:fs'

// @ts-expect-error missing types
import parse from 'parse-gitignore'

export interface FlatGitignoreOptions {
  files?: string | string[]
}

export interface FlatConfigItem {
  ignores: string[]
}

export default function ignore(options: FlatGitignoreOptions = {}): FlatConfigItem {
  const ignores: string[] = []

  const {
    files: _files = '.gitignore',
  } = options
  const files = Array.isArray(_files) ? _files : [_files]

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const parsed = parse(content)
      const globs = parsed.globs()
      for (const glob of globs) {
        if (glob.type === 'ignore')
          ignores.push(...glob.patterns)
        else if (glob.type === 'unignore')
          ignores.push(...glob.patterns.map((pattern: string) => `!${pattern}`))
      }
    }
    catch (error) {}
  }

  return {
    ignores,
  }
}
