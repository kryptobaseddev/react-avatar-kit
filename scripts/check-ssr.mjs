/**
 * Server rendering check.
 *
 * 1. Loads the built package under the `react-server` export condition and executes the
 *    component with no renderer, proving there are no hooks or client-only imports.
 *    (React forbids react-dom/server inside a react-server environment, so the DOM
 *    rendering half runs in a normal Node process below.)
 * 2. Renders the same built package through react-dom/server and inspects the markup.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { Avatar } from '../dist/index.js'
import { avatarToSvg } from '../dist/server.js'

const renderToStaticMarkup =
  ReactDOMServer.renderToStaticMarkup ?? ReactDOMServer.default?.renderToStaticMarkup

const failures = []

try {
  const probe = execFileSync('node', ['--conditions=react-server', 'scripts/ssr-rsc-probe.mjs'], {
    encoding: 'utf8',
  })
  console.log(probe.trim())
} catch (error) {
  failures.push(`react-server probe failed:\n${error.stdout ?? ''}${error.stderr ?? ''}`)
}

const markup = renderToStaticMarkup(
  createElement(Avatar, { seed: 'ada@example.com', size: 80, alt: 'Ada' }),
)

if (!markup.startsWith('<svg')) failures.push('Avatar did not render a root svg element')
if (!markup.includes('viewBox="0 0 200 200"')) failures.push('Avatar is missing its canvas viewBox')
if (!markup.includes('aria-label="Ada"')) failures.push('Avatar lost its accessible name')
if (markup.includes('NaN')) failures.push('Avatar rendered NaN coordinates')
if (markup.includes('undefined')) failures.push('Avatar rendered undefined values')

const serverMarkup = avatarToSvg('ada@example.com', { size: 512, alt: 'Ada' })
if (!serverMarkup.includes('width="512"')) failures.push('avatarToSvg ignored the size option')

for (const file of ['src/react/avatar.tsx', 'src/react/parts.tsx', 'src/index.ts']) {
  const source = readFileSync(file, 'utf8')
  if (/(^|[^.\w])use[A-Z]\w*\s*\(/.test(source)) failures.push(`${file} calls a React hook`)
  if (source.includes("'use client'") || source.includes('"use client"')) {
    failures.push(`${file} declares a client boundary`)
  }
}

if (failures.length) {
  console.error('\ncheck:ssr failed:')
  for (const failure of failures) console.error(` - ${failure}`)
  process.exit(1)
}

console.log(`ok ssr: rendered ${markup.length} bytes of markup through react-dom/server`)
