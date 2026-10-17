/**
 * Verifies the published API surface from both ESM and CJS entry points and that
 * every runtime export is documented in docs/api.md.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const failures = []

const EXPECTED = {
  '.': ['Avatar', 'createAvatar', 'palettes'],
  './core': ['createAvatar', 'palettes'],
  './server': ['avatarToSvg'],
}

function check(label, actual, expected) {
  const missing = expected.filter((name) => !actual.includes(name))
  const extra = actual.filter((name) => !expected.includes(name))
  if (missing.length) failures.push(`${label}: missing exports ${missing.join(', ')}`)
  if (extra.length) failures.push(`${label}: unexpected exports ${extra.join(', ')}`)
  if (!missing.length && !extra.length) console.log(`ok ${label}: ${actual.join(', ')}`)
}

const esm = {
  '.': Object.keys(await import(pathToFileURL('./dist/index.js').href)),
  './core': Object.keys(await import(pathToFileURL('./dist/core.js').href)),
  './server': Object.keys(await import(pathToFileURL('./dist/server.js').href)),
}

const cjs = {
  '.': Object.keys(require('../dist/index.cjs')),
  './core': Object.keys(require('../dist/core.cjs')),
  './server': Object.keys(require('../dist/server.cjs')),
}

for (const [entry, names] of Object.entries(EXPECTED)) {
  check(`esm ${entry}`, esm[entry].sort(), names)
  check(`cjs ${entry}`, cjs[entry].sort(), names)
}

const docs = readFileSync('docs/api.md', 'utf8')
for (const name of ['Avatar', 'createAvatar', 'palettes', 'avatarToSvg']) {
  if (!docs.includes(name)) failures.push(`docs/api.md does not document ${name}`)
}

const packageJson = require('../package.json')
for (const entry of ['.', './core', './server']) {
  const conditions = packageJson.exports?.[entry]
  for (const mode of ['import', 'require']) {
    const target = conditions?.[mode]?.default
    if (!target) {
      failures.push(`package.json exports["${entry}"].${mode} is missing`)
      continue
    }
    try {
      readFileSync(target.replace('./', ''))
    } catch {
      failures.push(`package.json exports["${entry}"].${mode} points at a missing file: ${target}`)
    }
  }
}

if (failures.length) {
  console.error('\ncheck:api failed:')
  for (const failure of failures) console.error(` - ${failure}`)
  process.exit(1)
}
console.log('\ncheck:api ok')
