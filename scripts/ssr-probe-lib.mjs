import { readdirSync, readFileSync } from 'node:fs'

/** Shared logic for the react-server probe. */
export async function createRscProbe() {
  const failures = []
  const mod = await import('../dist/index.js')

  if (typeof mod.Avatar !== 'function')
    failures.push('Avatar is not exported as a function under react-server')
  if (typeof mod.createAvatar !== 'function')
    failures.push('createAvatar is missing under react-server')

  const element = mod.Avatar({ seed: 'ada@example.com', size: 64 })
  if (element?.type !== 'svg') failures.push('Avatar did not return an svg element')
  if (element?.props?.viewBox !== '0 0 200 200')
    failures.push('Avatar lost its viewBox under react-server')

  const clientChunks = readdirSync('dist').filter(
    (file) => file.endsWith('.js') && file !== 'server.js',
  )
  for (const file of clientChunks) {
    if (/from\s*['"]react-dom/.test(readFileSync(`dist/${file}`, 'utf8'))) {
      failures.push(`${file} imports react-dom`)
    }
  }

  if (failures.length) {
    console.error('react-server probe failed:')
    for (const failure of failures) console.error(` - ${failure}`)
    process.exit(1)
  }
  console.log('ok react-server: Avatar loads and executes without react-dom or hooks')
}
