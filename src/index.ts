import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { convertIgnorePatternToMinimatch } from '@eslint/compat'

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

  /**
   * Current working directory.
   * Used to resolve relative paths.
   * @default process.cwd()
   */
  cwd?: string
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
    cwd = process.cwd(),
  } = options

  const files = Array.isArray(_files) ? _files : [_files]

  for (const file of files) {
    let content = ''
    try {
      content = fs.readFileSync(file, 'utf8')
    }
    catch (error) {
      if (strict)
        throw error
      continue
    }
    const relativePath = path.relative(cwd, path.dirname(file)).replaceAll('\\', '/')
    const globs = content.split(/\r?\n/u)
      .filter(line => line && !line.startsWith('#'))
      .map(line => convertIgnorePatternToMinimatch(line))
      .map(glob => relativeMinimatch(glob, relativePath, cwd))
      .filter(glob => glob !== null)

    ignores.push(...globs)
  }

  if (strict && files.length === 0)
    throw new Error('No .gitignore file found')

  return {
    name: options.name || 'gitignore',
    ignores,
  }
}

function relativeMinimatch(pattern: string, relativePath: string, cwd: string) {
  // if gitignore is in the current directory leave it as is
  if (['', '.', '/'].includes(relativePath))
    return pattern

  const negated = pattern.startsWith('!') ? '!' : ''
  let cleanPattern = negated ? pattern.slice(1) : pattern

  if (!relativePath.endsWith('/'))
    relativePath = `${relativePath}/`

  const isParent = relativePath.startsWith('..')
  // child directories need to just add path in start
  if (!isParent)
    return `${negated}${relativePath}${cleanPattern}`

  // uncle directories don't make sence
  if (!relativePath.match(/^(\.\.\/)+$/))
    throw new Error('The ignore file location should be either a parent or child directory')

  // if it has ** depth it may be left as is
  if (cleanPattern.startsWith('**'))
    return pattern

  // if glob doesn't match the parent dirs it should be ignored
  const parents = path.relative(path.resolve(cwd, relativePath), cwd).split(/[/\\]/)

  while (parents.length && cleanPattern.startsWith(`${parents[0]}/`)) {
    cleanPattern = cleanPattern.slice(parents[0].length + 1)
    parents.shift()
  }

  // if it has ** depth it may be left as is
  if (cleanPattern.startsWith('**'))
    return `${negated}${cleanPattern}`

  // if all parents are out, it's clean
  if (parents.length === 0)
    return `${negated}${cleanPattern}`

  // otherwise it doesn't matches the current folder
  return null
}

function findUpSync(name: string, { cwd = process.cwd() } = {}) {
  let directory = path.resolve(cwd)
  const { root } = path.parse(directory)

  while (directory && directory !== root) {
    const filePath = path.isAbsolute(name) ? name : path.join(directory, name)

    try {
      const stats = fs.statSync(filePath)

      if (stats.isFile()) {
        return filePath
      }
    }
    catch {}

    directory = path.dirname(directory)
  }
}
