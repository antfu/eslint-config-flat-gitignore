import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { findUpSync } from 'find-up-simple'

// @ts-expect-error missing types
import parse from 'parse-gitignore'

export interface FlatGitignoreOptions {
  /**
   * Name of the configuration.
   * @default 'gitignore'
   */
  name?: string
  /**
   * Path to `.gitignore` files, or files with compatible formats like `.eslintignore`.
   * @default ['.gitignore'] // or findUpSync('.gitignore')
   */
  files?: string | string[]
  /**
   * Throw an error if gitignore file not found.
   * @default true
   */
  strict?: boolean
  /**
   * Mark the current working directory as the root directory,
   * disable searching for `.gitignore` files in parent directories.
   *
   * This option is not effective when `files` is explicitly specified.
   * @default false
   */
  root?: boolean
}

export interface FlatConfigItem {
  ignores: string[]
  name?: string
}

const GITIGNORE = '.gitignore' as const

export default function ignore(options: FlatGitignoreOptions = {}): FlatConfigItem {
  const ignores: string[] = []

  const {
    root = false,
    files: _files = root ? GITIGNORE : findUpSync(GITIGNORE) || [],
    strict = true,
  } = options

  const files = Array.isArray(_files) ? _files : [_files]

  for (const file of files) {
    let content = ''
    let dir = ''
    try {
      dir = path.relative(process.cwd(), path.dirname(file)).replaceAll('\\', '/')
      // `..` dirs are not supported by ESLint
      dir = !dir || dir.startsWith('..') ? '' : `${dir}/`
      content = fs.readFileSync(file, 'utf8')
    }
    catch (error) {
      if (strict)
        throw error
      continue
    }
    const parsed = parse(`${content}\n`)
    const globs = parsed.globs()
    const sliceStart = (pattern: string) => pattern.startsWith('/') ? pattern.slice(1) : pattern
    for (const glob of globs) {
      if (glob.type === 'ignore')
        ignores.push(...glob.patterns.map((pattern: string) => `${dir}${sliceStart(pattern)}`))
      else if (glob.type === 'unignore')
        ignores.push(...glob.patterns.map((pattern: string) => `!${dir}${sliceStart(pattern)}`))
    }
  }

  if (strict && files.length === 0)
    throw new Error('No .gitignore file found')

  return {
    // `name` is still not working well in ESLint v8
    // name: options.name || 'gitignore',
    ignores,
  }
}
