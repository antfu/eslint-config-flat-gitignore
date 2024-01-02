import fs from 'node:fs'
import { findUpSync } from 'find-up'

// @ts-expect-error missing types
import parse from 'parse-gitignore'

export interface FlatGitignoreOptions {
  files?: string | string[]
  strict?: boolean
  fallbackToRoot?: boolean
}

export interface FlatConfigItem {
  ignores: string[]
}

const GITIGNORE = '.gitignore' as const

export default function ignore(options: FlatGitignoreOptions = {}): FlatConfigItem {
  const ignores: string[] = []

  const {
    files: _files = GITIGNORE,
    strict = true,
    fallbackToRoot = true,
  } = options
  const files = Array.isArray(_files) ? _files : [_files]

  for (const file of files) {
    let content = ''
    try {
      content = fs.readFileSync(file, 'utf8')
    }
    catch (error) {
      const upperGitignoreFilePath = findUpSync(GITIGNORE)
      if (fallbackToRoot) {
        if (upperGitignoreFilePath) {
          try {
            content = fs.readFileSync(upperGitignoreFilePath, 'utf8')
          }
          catch (error) {
            if (strict)
              throw error
            continue
          }
        }
      }
      if (!fallbackToRoot || !upperGitignoreFilePath) {
        if (strict)
          throw error
        continue
      }
    }
    const parsed = parse(`${content}\n`)
    const globs = parsed.globs()
    for (const glob of globs) {
      if (glob.type === 'ignore')
        ignores.push(...glob.patterns)
      else if (glob.type === 'unignore')
        ignores.push(...glob.patterns.map((pattern: string) => `!${pattern}`))
    }
  }

  return {
    ignores,
  }
}

ignore()
