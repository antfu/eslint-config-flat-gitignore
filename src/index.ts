import fs from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { toArray } from '@antfu/utils'
import { convertIgnorePatternToMinimatch } from '@eslint/compat'
import { findUpSync } from 'find-up-simple'

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
   * Path to `.gitmodules` file.
   * @default ['.gitmodules'] // or findUpSync('.gitmodules')
   */
  filesGitModules?: string | string[]

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
const GITMODULES = '.gitmodules' as const

export default function ignore(options: FlatGitignoreOptions = {}): FlatConfigItem {
  const ignores: string[] = []

  const {
    cwd = process.cwd(),
    root = false,
    files: _files = root ? GITIGNORE : findUpSync(GITIGNORE, { cwd }) || [],
    filesGitModules: _filesGitModules = root
      ? (fs.existsSync(join(cwd, GITMODULES)) ? GITMODULES : [])
      : findUpSync(GITMODULES, { cwd }) || [],
    strict = true,
  } = options

  const files = toArray(_files).map(file => resolve(cwd, file))
  const filesGitModules = toArray(_filesGitModules).map(file => resolve(cwd, file))

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
    const relativePath = relative(cwd, dirname(file)).replaceAll('\\', '/')
    const globs = content.split(/\r?\n/u)
      .filter(line => line && !line.startsWith('#'))
      .map(line => convertIgnorePatternToMinimatch(line))
      .map(glob => relativeMinimatch(glob, relativePath, cwd))
      .filter(glob => glob !== null)

    ignores.push(...globs)
  }

  for (const file of filesGitModules) {
    let content = ''
    try {
      content = fs.readFileSync(file, 'utf8')
    }
    catch (error) {
      if (strict)
        throw error
      continue
    }
    const dirs = parseGitSubmodules(content)
    ignores.push(...dirs.map(dir => `${dir}/**`))
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

  // if it has ** depth it may be left as is
  if (cleanPattern.startsWith('**'))
    return pattern

  // if glob doesn't match the parent dirs it should be ignored
  const parents = relative(resolve(cwd, relativePath), cwd).split(/[/\\]/)

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

function parseGitSubmodules(content: string): string[] {
  return content.split(/\r?\n/u)
    .map(line => line.match(/path\s*=\s*(.+)/u))
    .filter(match => match !== null)
    .map(match => match![1].trim())
}
