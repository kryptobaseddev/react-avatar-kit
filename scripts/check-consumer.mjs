/**
 * Consumer smoke test.
 *
 * Packs the real tarball, installs it into two throwaway projects (React 18 and
 * React 19) and renders the documented two-line API from each one.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const REACT_VERSIONS = ['18', '19']
const failures = []

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--json', '--ignore-scripts'], { encoding: 'utf8' }),
)
const tarball = join(process.cwd(), packed[0].filename)
console.log(`packed ${packed[0].filename}`)

const consumer = `
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Avatar, createAvatar, palettes } from 'react-avatar-kit'
import { avatarToSvg } from 'react-avatar-kit/server'

const markup = renderToStaticMarkup(createElement(Avatar, { seed: 'ada@example.com', size: 64 }))
if (!markup.startsWith('<svg')) throw new Error('Avatar did not render an svg')
if (!markup.includes('viewBox="0 0 200 200"')) throw new Error('Avatar viewBox missing')
if (!markup.includes('aria-hidden="true"')) throw new Error('Decorative avatar is not aria-hidden')

const config = createAvatar('ada@example.com')
if (config.seed !== 'ada@example.com') throw new Error('createAvatar lost the seed')
if (!palettes.default || palettes.default.skins.length === 0) throw new Error('palettes missing')

const svg = avatarToSvg('ada@example.com', { size: 128 })
if (!svg.includes('width="128"')) throw new Error('avatarToSvg size missing')
console.log('consumer render ok', markup.length, svg.length)
`

for (const version of REACT_VERSIONS) {
  const dir = mkdtempSync(join(tmpdir(), `ark-consumer-${version}-`))
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: `consumer-react-${version}`, private: true, type: 'module' }, null, 2),
  )
  writeFileSync(join(dir, 'render.mjs'), consumer)

  try {
    execFileSync(
      'npm',
      [
        'install',
        '--no-audit',
        '--no-fund',
        '--silent',
        `react@${version}`,
        `react-dom@${version}`,
        tarball,
      ],
      { cwd: dir, stdio: 'pipe' },
    )
    const output = execFileSync('node', ['render.mjs'], { cwd: dir, encoding: 'utf8' })
    console.log(`ok react@${version}: ${output.trim()}`)
  } catch (error) {
    const detail = error.stdout?.toString() || error.stderr?.toString() || error.message
    failures.push(`react@${version}: ${detail.slice(0, 800)}`)
  }
}

const installed = REACT_VERSIONS.every(
  (version) => !failures.some((f) => f.startsWith(`react@${version}`)),
)
if (!installed) {
  console.error('\ncheck:consumer failed:')
  for (const failure of failures) console.error(`\n${failure}`)
  process.exit(1)
}
rmSync(tarball, { force: true })
console.log('\ncheck:consumer ok')
