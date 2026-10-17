/**
 * Compatibility gate: existing seeded avatars must stay byte-identical.
 *
 * Compares createAvatar() for every frozen fixture case against
 * test/golden/seeds.json and fails on any difference, including new keys.
 */
import { readFileSync } from 'node:fs'
import { createAvatar } from '../dist/core.js'

const fixture = JSON.parse(readFileSync('test/golden/seeds.json', 'utf8'))
const failures = []

for (const golden of fixture.cases) {
  const actual = createAvatar(golden.input)
  const expected = golden.config
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  if (actualJson !== expectedJson) {
    failures.push(`seed ${JSON.stringify(golden.input)} changed\n  expected ${expectedJson}\n  actual   ${actualJson}`)
  }
}

if (failures.length > 0) {
  console.error(`check:compat failed for ${failures.length} case(s):`)
  for (const failure of failures.slice(0, 3)) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`check:compat ok: ${fixture.cases.length} seeded configs unchanged`)
