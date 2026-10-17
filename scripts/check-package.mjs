/**
 * Verifies what actually ships: tarball contents, exports resolution, zero runtime
 * dependencies, ESM/CJS graph hygiene and the gzip size budget.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const failures = []
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

const REQUIRED_FILES = [
  'package.json',
  'README.md',
  'docs/api.md',
  'LICENSE',
  'NOTICE.md',
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/index.d.cts',
  'dist/core.js',
  'dist/core.cjs',
  'dist/server.js',
  'dist/server.cjs',
]
const FORBIDDEN_PREFIXES = ['src/', 'site/', 'test/', 'e2e/', 'scripts/', '.github/', 'tools/']

if (Object.keys(pkg.dependencies ?? {}).length > 0) {
  failures.push(
    `runtime dependencies must stay empty, found ${Object.keys(pkg.dependencies).join(', ')}`,
  )
}
if (pkg.sideEffects !== false) failures.push('package.json must declare "sideEffects": false')
if (!pkg.peerDependencies?.react?.includes('18'))
  failures.push('peerDependencies.react must allow React 18')

function gzipSize(path) {
  return gzipSync(readFileSync(path)).length
}

function distFiles() {
  return readdirSync('dist').filter((file) => !file.endsWith('.map'))
}

const esmFiles = distFiles().filter((file) => file.endsWith('.js'))
const entryGzip = esmFiles
  .filter((file) => !file.startsWith('server'))
  .reduce((total, file) => total + gzipSize(join('dist', file)), 0)

const BUDGET_ENTRY_GZIP = 30 * 1024
if (entryGzip > BUDGET_ENTRY_GZIP) {
  failures.push(`client entry graph is ${(entryGzip / 1024).toFixed(1)} kB gzip, budget is 30 kB`)
} else {
  console.log(`ok size: client entry graph ${(entryGzip / 1024).toFixed(1)} kB gzip (budget 30 kB)`)
}

function runtimeGraph(entry) {
  const seen = new Set()
  const queue = [entry]
  while (queue.length > 0) {
    const file = queue.pop()
    if (seen.has(file)) continue
    seen.add(file)
    const source = readFileSync(join('dist', file), 'utf8')
    for (const match of source.matchAll(/from\s*["'](\.\/[^"']+)["']/g)) {
      const spec = match[1].replace('./', '')
      if (spec.endsWith('.js')) queue.push(spec)
    }
  }
  return [...seen]
}

const coreGraph = runtimeGraph('core.js')
const coreGzip = coreGraph.reduce((total, file) => total + gzipSize(join('dist', file)), 0)
const BUDGET_CORE_GZIP = 10 * 1024
if (coreGzip > BUDGET_CORE_GZIP) {
  failures.push(`/core graph is ${(coreGzip / 1024).toFixed(1)} kB gzip, budget is 10 kB`)
}
for (const file of coreGraph) {
  const source = readFileSync(join('dist', file), 'utf8')
  if (source.includes('viewBox') || source.includes('d="M')) {
    failures.push(`/core graph includes illustration markup in ${file}`)
  }
}

for (const file of esmFiles) {
  const source = readFileSync(join('dist', file), 'utf8')
  if (file !== 'server.js' && /from\s*['"]react-dom/.test(source)) {
    failures.push(`${file} imports react-dom; the client entry must not`)
  }
  if (file !== 'server.js' && source.includes('"use client"')) {
    failures.push(`${file} declares "use client"; the avatar must stay server-compatible`)
  }
}

for (const [entry, conditions] of Object.entries(pkg.exports)) {
  if (entry === './package.json') continue
  for (const mode of ['import', 'require']) {
    const target = conditions[mode]?.default
    const types = conditions[mode]?.types
    for (const file of [target, types]) {
      if (!file) {
        failures.push(`exports["${entry}"].${mode} is incomplete`)
        continue
      }
      if (!existsSync(file.replace('./', '')))
        failures.push(`exports["${entry}"].${mode} -> missing ${file}`)
    }
  }
}

const pack = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    encoding: 'utf8',
  }),
)
const files = pack[0].files.map((entry) => entry.path)
const unpackedSize = pack[0].unpackedSize

for (const required of REQUIRED_FILES) {
  if (!files.includes(required)) failures.push(`tarball is missing ${required}`)
}
for (const file of files) {
  if (FORBIDDEN_PREFIXES.some((prefix) => file.startsWith(prefix))) {
    failures.push(`tarball leaks ${file}`)
  }
}

const BUDGET_UNPACKED = 400 * 1024
if (unpackedSize > BUDGET_UNPACKED) {
  failures.push(`tarball unpacks to ${(unpackedSize / 1024).toFixed(1)} kB, budget is 400 kB`)
} else {
  console.log(`ok tarball: ${files.length} files, ${(unpackedSize / 1024).toFixed(1)} kB unpacked`)
}

console.log(
  `ok core: ${coreGraph.length} files, ${(coreGzip / 1024).toFixed(1)} kB gzip, art-free (budget 10 kB)`,
)

if (statSync('dist').isDirectory() === false) failures.push('dist is not a directory')

if (failures.length) {
  console.error('\ncheck:package failed:')
  for (const failure of failures) console.error(` - ${failure}`)
  process.exit(1)
}
console.log('\ncheck:package ok')
