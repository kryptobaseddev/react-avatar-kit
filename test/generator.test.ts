import { describe, expect, it } from 'vitest'
import { contrast } from '../src/core/color'
import { createAvatar } from '../src/core/create-avatar'
import { palettes } from '../src/core/palettes'
import type { AvatarConfig, AvatarOptions, PaletteName } from '../src/core/types'
import fixture from './golden/seeds.json' with { type: 'json' }

const CONFIG_KEYS: (keyof AvatarConfig)[] = [
  'seed',
  'palette',
  'background',
  'skin',
  'hair',
  'hairColor',
  'highlight',
  'hat',
  'hatColor',
  'ears',
  'eyes',
  'brows',
  'glasses',
  'nose',
  'mouth',
  'shirt',
  'shirtColor',
  'shape',
  'facialHair',
  'earring',
  'headphones',
  'headphoneColor',
]

describe('createAvatar determinism', () => {
  it('returns an identical config for the same seed', () => {
    expect(createAvatar('ada@example.com')).toEqual(createAvatar('ada@example.com'))
  })

  it('does not depend on call order or other avatars', () => {
    const first = createAvatar('grace')
    createAvatar('linus')
    createAvatar()
    expect(createAvatar('grace')).toEqual(first)
  })

  it('trims seeds and treats an empty seed as the default seed', () => {
    expect(createAvatar('  ada  ').seed).toBe('ada')
    expect(createAvatar('   ').seed).toBe('default')
    expect(createAvatar({}).seed).toBe('default')
  })

  it('keeps every untouched field stable when one override is added', () => {
    const base = createAvatar('ada')
    const overridden = createAvatar({ seed: 'ada', eyes: 'smile' })
    for (const key of CONFIG_KEYS) {
      if (key === 'eyes') continue
      expect(overridden[key]).toEqual(base[key])
    }
    expect(overridden.eyes).toBe('smile')
  })

  it('generates a random seed when called without arguments and replays it', () => {
    const random = createAvatar()
    expect(random.seed.length).toBeGreaterThan(0)
    expect(createAvatar(random.seed)).toEqual(random)
  })

  it('round-trips through JSON', () => {
    const config = createAvatar('margaret')
    const parsed = JSON.parse(JSON.stringify(config)) as AvatarConfig
    expect(createAvatar(parsed)).toEqual(config)
    expect(JSON.parse(JSON.stringify(config))).toEqual(config)
  })

  it('matches the golden fixture byte for byte', () => {
    for (const golden of fixture.cases) {
      const actual = createAvatar(golden.input as string | AvatarOptions)
      expect(actual).toEqual(golden.config)
    }
  })
})

describe('createAvatar options', () => {
  it('honours every explicit override', () => {
    const config = createAvatar({
      seed: 'ada',
      palette: 'vivid',
      background: { from: '#112233', to: '#445566', angle: 120 },
      skin: '#ABCDEF',
      hair: 'thick',
      hairColor: '#123456',
      highlight: true,
      hat: 'turban',
      hatColor: '#654321',
      ears: 'big',
      eyes: 'smile',
      brows: 'arched',
      glasses: 'square',
      nose: 'round',
      mouth: 'laugh',
      shirt: 'polo',
      shirtColor: '#FEDCBA',
      shape: 'rounded',
    })
    expect(config).toMatchObject({
      seed: 'ada',
      palette: 'vivid',
      background: { from: '#112233', to: '#445566', angle: 120 },
      skin: '#ABCDEF',
      hair: 'thick',
      hairColor: '#123456',
      highlight: true,
      hat: 'turban',
      hatColor: '#654321',
      ears: 'big',
      eyes: 'smile',
      brows: 'arched',
      glasses: 'square',
      nose: 'round',
      mouth: 'laugh',
      shirt: 'polo',
      shirtColor: '#FEDCBA',
      shape: 'rounded',
    })
  })

  it('accepts a plain CSS colour background', () => {
    expect(createAvatar({ seed: 'ada', background: 'oklch(0.7 0.1 200)' }).background).toBe(
      'oklch(0.7 0.1 200)',
    )
  })

  it('ignores a non-finite gradient angle and trims gradient colours', () => {
    const config = createAvatar({
      seed: 'ada',
      background: { from: ' #112233 ', to: '#445566', angle: Number.NaN },
    })
    expect(config.background).toEqual({ from: '#112233', to: '#445566' })
  })

  it('falls back to generated values for invalid input', () => {
    const generated = createAvatar('ada')
    const invalid = createAvatar({
      seed: 'ada',
      hair: 'banana',
      hat: 'crown',
      eyes: 'laser',
      shape: 'blob',
      skin: '<script>alert(1)</script>',
      palette: 'sunset',
    } as unknown as AvatarOptions)
    expect(invalid.hair).toBe(generated.hair)
    expect(invalid.hat).toBe(generated.hat)
    expect(invalid.eyes).toBe(generated.eyes)
    expect(invalid.shape).toBe(generated.shape)
    expect(invalid.skin).toBe(generated.skin)
    expect(invalid.palette).toBe(generated.palette)
  })

  it('keeps hair hidden by default when a hat is generated', () => {
    for (const seed of ['keaton', 'ada', 'grace', 'linus']) {
      const config = createAvatar(seed)
      if (config.hat !== 'none') expect(config.hair).toBe('none')
    }
  })

  it('renders explicit hair together with an explicit hat', () => {
    expect(createAvatar({ seed: 'ada', hat: 'beanie', hair: 'long' })).toMatchObject({
      hat: 'beanie',
      hair: 'long',
    })
  })
})

describe('palettes', () => {
  const names = Object.keys(palettes) as PaletteName[]

  it('exposes the six documented palettes', () => {
    expect(names.sort()).toEqual(['default', 'earth', 'mono', 'neon', 'pastel', 'vivid'])
  })

  it('only picks colours from the selected palette unless overridden', () => {
    for (const palette of names) {
      const config = createAvatar({ seed: 'ada', palette })
      expect(config.palette).toBe(palette)
      expect(palettes[palette].skins).toContain(config.skin)
      expect(palettes[palette].hair).toContain(config.hairColor)
      expect(palettes[palette].shirts).toContain(config.shirtColor)
    }
  })

  it('adds the 1.1 parts only when requested', () => {
    const base = createAvatar('ada')
    expect(base.facialHair).toBeUndefined()
    expect(base.earring).toBeUndefined()
    expect(base.headphones).toBeUndefined()

    const rich = createAvatar({
      seed: 'ada',
      facialHair: 'beard',
      earring: 'hoop',
      headphones: 'over-ear',
      headphoneColor: '#112233',
    })
    expect(rich.facialHair).toBe('beard')
    expect(rich.earring).toBe('hoop')
    expect(rich.headphones).toBe('over-ear')
    expect(rich.headphoneColor).toBe('#112233')
    for (const key of CONFIG_KEYS) {
      if (
        key === 'facialHair' ||
        key === 'earring' ||
        key === 'headphones' ||
        key === 'headphoneColor'
      )
        continue
      expect(rich[key]).toEqual(base[key])
    }
  })

  it('ignores invalid 1.1 part values', () => {
    const config = createAvatar({
      seed: 'ada',
      facialHair: 'muttonchops',
      earring: 'crown',
      headphones: 'earbuds',
    } as unknown as AvatarOptions)
    expect(config.facialHair).toBeUndefined()
    expect(config.earring).toBeUndefined()
    expect(config.headphones).toBeUndefined()
  })

  it('exposes earth and neon palettes', () => {
    expect(palettes.earth.skins.length).toBeGreaterThan(0)
    expect(palettes.neon.gradients.length).toBeGreaterThan(0)
    const earth = createAvatar({ seed: 'ada', palette: 'earth' })
    const neon = createAvatar({ seed: 'ada', palette: 'neon' })
    expect(palettes.earth.skins).toContain(earth.skin)
    expect(palettes.neon.skins).toContain(neon.skin)
    expect(earth.palette).toBe('earth')
    expect(neon.palette).toBe('neon')
  })

  it('keeps generated background and shirt colours apart', () => {
    for (const seed of ['ada', 'grace', 'linus', 'margaret', 'alan', 'radha']) {
      const config = createAvatar(seed)
      if (typeof config.background !== 'string') continue
      expect(contrast(config.background, config.shirtColor)).toBeGreaterThanOrEqual(0.16)
    }
  })
})
