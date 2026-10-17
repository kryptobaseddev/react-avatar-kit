/**
 * Examples gate: all four apps install and typecheck; Next.js and Vite also build.
 *
 * Uses --install-links so the local package is copied instead of symlinked, which keeps
 * React type resolution inside each example.
 */
import { execFileSync } from 'node:child_process'

const EXAMPLES = [
  { dir: 'examples/next-app-router', run: ['run', 'build'] },
  { dir: 'examples/vite', run: ['run', 'build'] },
  { dir: 'examples/react-router', run: ['run', 'typecheck'] },
  { dir: 'examples/remix', run: ['run', 'typecheck'] },
]

const failures = []

for (const example of EXAMPLES) {
  try {
    execFileSync('npm', ['install', '--no-audit', '--no-fund', '--install-links'], {
      cwd: example.dir,
      stdio: 'pipe',
    })
    execFileSync('npm', example.run, { cwd: example.dir, stdio: 'pipe' })
    console.log(`ok ${example.dir}: ${example.run.join(' ')}`)
  } catch (error) {
    const detail = error.stdout?.toString() || error.stderr?.toString() || error.message
    failures.push(`${example.dir}: ${detail.slice(0, 1200)}`)
    console.log(`FAIL ${example.dir}`)
  }
}

if (failures.length > 0) {
  console.error('\ncheck:examples failed:')
  for (const failure of failures) console.error(`\n${failure}`)
  process.exit(1)
}
console.log('\ncheck:examples ok')
