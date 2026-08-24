// Anchors the production code's .git lookup so tests don't escape
// into the host repo. Git refuses to track paths under `/.git/`,
// so this runs from the pretest hook instead of being committed.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

const fixtures = [
  { path: '.git/info/exclude', content: '' },
  { path: 'workspace-with-gitignore/.git/info/exclude', content: '' },
  { path: 'workspace-without-gitignore/.git/info/exclude', content: '' },
  { path: 'workspace-with-info-exclude/.gitignore', content: '*.log\n' },
  { path: 'workspace-with-info-exclude/.git/info/exclude', content: '*.tmp\n' },
]

for (const { path, content } of fixtures) {
  const full = join(here, path)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf8')
}

console.warn(`[setup-test-fixtures] ${fixtures.length} fixture files ensured under ${here}`)
