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

const clientConsumer = `
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
})
globalThis.HTMLElement = dom.window.HTMLElement

const { createElement } = await import('react')
const { createRoot } = await import('react-dom/client')
const { flushSync } = await import('react-dom')
const { Avatar } = await import('react-avatar-kit')

const container = document.getElementById('root')
const root = createRoot(container)
flushSync(() => {
  root.render(createElement(Avatar, { seed: 'ada@example.com', size: 96, alt: 'Ada' }))
})

const svg = container.querySelector('svg')
if (!svg) throw new Error('client render produced no svg')
if (svg.getAttribute('viewBox') !== '0 0 200 200') throw new Error('unexpected viewBox')
if (svg.getAttribute('aria-label') !== 'Ada') throw new Error('missing accessible name')
if (svg.getAttribute('width') !== '96') throw new Error('missing width')
root.unmount()
console.log('client render ok')
`

const typeConsumer = `
import { Avatar, createAvatar, palettes } from 'react-avatar-kit'
import type {
  AvatarConfig,
  AvatarOptions,
  AvatarProps,
  Palette,
  PaletteName,
  Shape,
} from 'react-avatar-kit'

const options: AvatarOptions = { seed: 'ada', hair: 'mohawk', shape: 'rounded' }
const config: AvatarConfig = createAvatar(options)
const paletteName: PaletteName = 'pastel'
const palette: Palette = palettes[paletteName]
const shapes: Shape[] = ['circle', 'rounded', 'square', 'none']
const props: Partial<AvatarProps> = { seed: 'ada', size: 64 }
const element = <Avatar {...props} config={config} />
export const used = { element, shapes, skins: palette.skins.length }
`

const tsconfigs = {
  bundler: {
    compilerOptions: {
      strict: true,
      noEmit: true,
      jsx: 'react-jsx',
      module: 'esnext',
      moduleResolution: 'bundler',
      target: 'es2022',
      skipLibCheck: true,
    },
    include: ['types.tsx'],
  },
  strict: {
    compilerOptions: {
      strict: true,
      noEmit: true,
      jsx: 'react-jsx',
      module: 'esnext',
      moduleResolution: 'bundler',
      target: 'es2022',
      skipLibCheck: false,
    },
    include: ['types.tsx'],
  },
  node16: {
    compilerOptions: {
      strict: true,
      noEmit: true,
      jsx: 'react-jsx',
      module: 'node16',
      moduleResolution: 'node16',
      target: 'es2022',
      skipLibCheck: true,
    },
    include: ['types.tsx'],
  },
}

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
  writeFileSync(join(dir, 'client.mjs'), clientConsumer)
  writeFileSync(join(dir, 'types.tsx'), typeConsumer)
  for (const [name, config] of Object.entries(tsconfigs)) {
    writeFileSync(join(dir, `tsconfig.${name}.json`), JSON.stringify(config, null, 2))
  }

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
        '@types/react@19',
        'jsdom@30',
        'typescript@7',
        tarball,
      ],
      { cwd: dir, stdio: 'pipe' },
    )
    const output = execFileSync('node', ['render.mjs'], { cwd: dir, encoding: 'utf8' })
    const clientOutput = execFileSync('node', ['client.mjs'], { cwd: dir, encoding: 'utf8' })
    for (const name of Object.keys(tsconfigs)) {
      execFileSync('npx', ['tsc', '-p', `tsconfig.${name}.json`], { cwd: dir, stdio: 'pipe' })
    }
    console.log(
      `ok react@${version}: ${output.trim()} + ${clientOutput.trim()} + types resolve (bundler, node16, strict)`,
    )
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
