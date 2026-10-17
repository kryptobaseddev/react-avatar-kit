import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createAvatar } from '../dist/core.js'

const seeds = [
  'ada',
  'grace',
  'linus',
  'margaret',
  'alan',
  'edsger',
  'barbara',
  'ken',
  'dennis',
  'donald',
  'radia',
  'vint',
  'tim',
  'bjarne',
  'james',
  'guido',
  'yukihiro',
  'brendan',
  'sophie',
  'hannah',
  'keaton',
  'kryptobaseddev',
  'react-avatar-kit',
  'user@example.com',
  ' space ',
  'UPPER',
  'üñïçø∂é',
  '0',
  'a'.repeat(200),
  '🔥',
]

const cases = [
  ...seeds.map((seed) => ({ input: seed, config: createAvatar(seed) })),
  ...['default', 'pastel', 'vivid', 'mono'].map((palette) => ({
    input: { seed: 'keaton', palette },
    config: createAvatar({ seed: 'keaton', palette }),
  })),
  {
    input: { seed: 'ada', hair: 'mohawk', eyes: 'smile', background: '#112233' },
    config: createAvatar({ seed: 'ada', hair: 'mohawk', eyes: 'smile', background: '#112233' }),
  },
  {
    input: { seed: 'ada', background: { from: '#ff0000', to: '#0000ff', angle: 90 } },
    config: createAvatar({
      seed: 'ada',
      background: { from: '#ff0000', to: '#0000ff', angle: 90 },
    }),
  },
]

const target = process.argv[2] ?? 'test/golden/seeds.json'
const payload = { version: 1, cases }
writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`)
// Keep the temp dir import used so Node does not warn about unused modules in future edits.
mkdtempSync(join(tmpdir(), 'ark-golden-'))
console.log(`wrote ${cases.length} golden cases to ${target}`)
