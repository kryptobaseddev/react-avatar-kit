/**
 * Builds the docs search index from the public source surface.
 *
 * The index is committed output of this script: exports, every part value and every
 * palette name must appear, which `check:docs` enforces.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

const indexSource = read('src/index.ts')
const typesSource = read('src/core/types.ts')
const palettesSource = read('src/core/palettes.ts')

const runtimeExports = ['Avatar', 'createAvatar', 'palettes']
const typeExports = (() => {
  const names = new Set()
  for (const match of indexSource.matchAll(/export type \{([\s\S]*?)\}/g)) {
    for (const raw of match[1].split(',')) {
      const name = raw.trim()
      if (name) names.add(name)
    }
  }
  return [...names].sort()
})()

const unions = (() => {
  const out = {}
  for (const match of typesSource.matchAll(/export type (\w+) = ([^\n]+)/g)) {
    const [, name, body] = match
    out[name] = [...body.matchAll(/'([^']+)'/g)].map((m) => m[1])
  }
  return out
})()

const paletteNames = [...palettesSource.matchAll(/^ {2}(\w+): \{/gm)].map((m) => m[1])

const entries = []

for (const name of runtimeExports) {
  entries.push({
    kind: 'export',
    title: name,
    value: name,
    text: `${name} public export runtime API`,
  })
}
for (const name of typeExports) {
  entries.push({ kind: 'type', title: name, value: name, text: `${name} public type export` })
}

const PART_GROUPS = [
  'HairStyle',
  'FacialHair',
  'Earring',
  'Headphones',
  'HatStyle',
  'EyeStyle',
  'BrowStyle',
  'GlassesStyle',
  'NoseStyle',
  'MouthStyle',
  'ShirtStyle',
  'EarSize',
  'Shape',
]
for (const group of PART_GROUPS) {
  for (const value of unions[group] ?? []) {
    entries.push({
      kind: 'part',
      title: `${group}: ${value}`,
      value,
      text: `${value} ${group} part option`,
    })
  }
}

for (const name of paletteNames) {
  entries.push({
    kind: 'palette',
    title: `palette: ${name}`,
    value: name,
    text: `${name} palette colours`,
  })
}

const payload = { generatedFrom: 'src', entries }
writeFileSync('docs-site/src/search-index.json', `${JSON.stringify(payload, null, 2)}\n`)
console.log(`docs index: ${entries.length} entries`)
