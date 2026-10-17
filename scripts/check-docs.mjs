/**
 * Docs coverage gate: the search index must include every public export, part value
 * and palette, and the built docs site must contain the OG demo and search UI.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'

const failures = []

const indexSource = readFileSync('src/index.ts', 'utf8')
const typesSource = readFileSync('src/core/types.ts', 'utf8')
const palettesSource = readFileSync('src/core/palettes.ts', 'utf8')
const index = JSON.parse(readFileSync('docs-site/src/search-index.json', 'utf8'))
const entries = index.entries ?? []
const titles = new Set(entries.map((entry) => entry.title))
const values = new Set(entries.map((entry) => entry.value))

const runtimeExports = ['Avatar', 'createAvatar', 'palettes']
const typeExports = [...indexSource.matchAll(/export type \{([\s\S]*?)\}/g)].flatMap((match) =>
  match[1]
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean),
)
for (const name of [...runtimeExports, ...typeExports]) {
  if (!titles.has(name)) failures.push(`search index is missing export ${name}`)
}

const unions = {}
for (const match of typesSource.matchAll(/export type (\w+) = ([^\n]+)/g)) {
  unions[match[1]] = [...match[2].matchAll(/'([^']+)'/g)].map((m) => m[1])
}
const groups = [
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
for (const group of groups) {
  for (const value of unions[group] ?? []) {
    if (!values.has(value)) failures.push(`search index is missing ${group} value ${value}`)
  }
}

const paletteNames = [...palettesSource.matchAll(/^ {2}(\w+): \{/gm)].map((match) => match[1])
for (const name of paletteNames) {
  if (!values.has(name)) failures.push(`search index is missing palette ${name}`)
}

if (!existsSync('docs-site/dist/index.html')) {
  failures.push('docs-site/dist/index.html is missing; run npm run build:docs')
} else {
  const html = readFileSync('docs-site/dist/index.html', 'utf8')
  if (!html.includes('/react-avatar-kit/docs/')) {
    failures.push('built docs HTML does not use the /react-avatar-kit/docs/ base path')
  }
  const assets = readdirSync('docs-site/dist/assets')
  const js = assets.filter((file) => file.endsWith('.js'))
  const bundle = js.map((file) => readFileSync(`docs-site/dist/assets/${file}`, 'utf8')).join('\n')
  for (const marker of ['og-avatar', 'og-download-svg', 'docs-search', 'example-tab-']) {
    if (!bundle.includes(marker))
      failures.push(`built docs bundle is missing the ${marker} demo marker`)
  }
}

if (failures.length > 0) {
  console.error('check:docs failed:')
  for (const failure of failures) console.error(` - ${failure}`)
  process.exit(1)
}
console.log(
  `check:docs ok: ${entries.length} indexed entries cover ${runtimeExports.length + typeExports.length} exports, ${paletteNames.length} palettes and every part value`,
)
