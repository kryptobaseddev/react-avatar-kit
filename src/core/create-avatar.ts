import { contrast, isColor, normalizeColor } from './color'
import { createRng, pick, randomIndex, weightedPick } from './hash'
import { paletteNames, palettes } from './palettes'
import type {
  AvatarConfig,
  AvatarGradient,
  AvatarOptions,
  BrowStyle,
  EarSize,
  EyeStyle,
  GlassesStyle,
  HairStyle,
  HatStyle,
  MouthStyle,
  NoseStyle,
  Palette,
  PaletteName,
  Shape,
  ShirtStyle,
} from './types'

const DEFAULT_SEED = 'default'
const RANDOM_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const CONTRAST_TARGET = 0.16

const HAIR_STYLES: readonly HairStyle[] = ['short', 'thick', 'mohawk', 'long', 'bob', 'none']
const HAT_STYLES: readonly HatStyle[] = ['none', 'beanie', 'turban']
const EYE_STYLES: readonly EyeStyle[] = ['round', 'oval', 'smile']
const BROW_STYLES: readonly BrowStyle[] = ['straight', 'arched']
const GLASSES_STYLES: readonly GlassesStyle[] = ['none', 'round', 'square']
const NOSE_STYLES: readonly NoseStyle[] = ['short', 'round', 'long']
const MOUTH_STYLES: readonly MouthStyle[] = ['smile', 'laugh', 'peace']
const SHIRT_STYLES: readonly ShirtStyle[] = ['tee', 'hoodie', 'polo']
const EAR_SIZES: readonly EarSize[] = ['small', 'big']
const SHAPES: readonly Shape[] = ['circle', 'rounded', 'square', 'none']

type Weights<T> = readonly (readonly [T, number])[]

const HAIR_WEIGHTS: Weights<HairStyle> = [
  ['short', 26],
  ['thick', 16],
  ['long', 15],
  ['bob', 13],
  ['mohawk', 7],
  ['none', 3],
]
const HAT_WEIGHTS: Weights<HatStyle> = [
  ['none', 84],
  ['beanie', 9],
  ['turban', 7],
]
const EYE_WEIGHTS: Weights<EyeStyle> = [
  ['oval', 42],
  ['round', 36],
  ['smile', 22],
]
const BROW_WEIGHTS: Weights<BrowStyle> = [
  ['straight', 62],
  ['arched', 38],
]
const GLASSES_WEIGHTS: Weights<GlassesStyle> = [
  ['none', 78],
  ['round', 11],
  ['square', 11],
]
const NOSE_WEIGHTS: Weights<NoseStyle> = [
  ['short', 42],
  ['round', 36],
  ['long', 22],
]
const MOUTH_WEIGHTS: Weights<MouthStyle> = [
  ['smile', 50],
  ['laugh', 28],
  ['peace', 22],
]
const SHIRT_WEIGHTS: Weights<ShirtStyle> = [
  ['tee', 42],
  ['hoodie', 33],
  ['polo', 25],
]
const EAR_WEIGHTS: Weights<EarSize> = [
  ['small', 68],
  ['big', 32],
]
const HIGHLIGHT_WEIGHTS: Weights<boolean> = [
  [false, 64],
  [true, 36],
]
const BACKGROUND_WEIGHTS = [
  ['solid', 72],
  ['gradient', 28],
] as const

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined
}

function isGradient(value: unknown): value is AvatarGradient {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return isColor(candidate.from) && isColor(candidate.to)
}

function normalizeSeed(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function randomSeed(): string {
  let seed = ''
  for (let index = 0; index < 14; index += 1) {
    seed += RANDOM_ALPHABET[randomIndex(Math.random, RANDOM_ALPHABET.length)]
  }
  return seed
}

/** Picks a palette colour, skipping `avoid` entries and preferring contrast. */
function pickColor(
  rng: () => number,
  pool: readonly string[],
  avoid: readonly string[],
  reference?: string,
): string {
  const candidates = pool.filter((color) => !avoid.includes(color))
  const available = candidates.length > 0 ? candidates : pool
  if (reference) {
    const contrasting = available.filter((color) => {
      const distance = contrast(color, reference)
      return distance !== null && distance >= CONTRAST_TARGET
    })
    if (contrasting.length > 0) return pick(rng, contrasting)
  }
  return pick(rng, available)
}

function generateBackground(
  rng: () => number,
  palette: Palette,
  avoid: readonly string[],
): AvatarConfig['background'] {
  const kind = weightedPick(rng, BACKGROUND_WEIGHTS)
  if (kind === 'gradient' && palette.gradients.length > 0) {
    const gradients = palette.gradients.filter(
      (gradient) => !avoid.includes(gradient.from) && !avoid.includes(gradient.to),
    )
    return pick(rng, gradients.length > 0 ? gradients : palette.gradients)
  }
  return pickColor(rng, palette.backgrounds, avoid)
}

/**
 * Builds an avatar.
 *
 * - `createAvatar('seed')` is deterministic.
 * - `createAvatar({ seed, hair: 'mohawk' })` applies overrides on top of it.
 * - `createAvatar()` generates a random avatar and returns the seed it used.
 */
export function createAvatar(input?: string | AvatarOptions): AvatarConfig {
  const provided: AvatarOptions = typeof input === 'string' ? { seed: input } : (input ?? {})
  const isRandom = input === undefined
  const seed = normalizeSeed(provided.seed) ?? (isRandom ? randomSeed() : DEFAULT_SEED)

  const paletteName: PaletteName = oneOf(provided.palette, paletteNames) ?? 'default'
  const palette = palettes[paletteName]
  const stream = (channel: string) => createRng(`${seed}\u0000${channel}`)

  const hat = oneOf(provided.hat, HAT_STYLES) ?? weightedPick(stream('hat'), HAT_WEIGHTS)
  const hair =
    oneOf(provided.hair, HAIR_STYLES) ??
    (hat === 'none' ? weightedPick(stream('hair'), HAIR_WEIGHTS) : 'none')

  const skin = normalizeColor(provided.skin, pick(stream('skin'), palette.skins))
  const hairColor = normalizeColor(
    provided.hairColor,
    pickColor(stream('hair-color'), palette.hair, []),
  )
  const hatColor = normalizeColor(
    provided.hatColor,
    pickColor(stream('hat-color'), palette.hats, [hairColor]),
  )
  const shirt = oneOf(provided.shirt, SHIRT_STYLES) ?? weightedPick(stream('shirt'), SHIRT_WEIGHTS)

  const background =
    (isGradient(provided.background) ? provided.background : undefined) ??
    (isColor(provided.background) ? provided.background : undefined) ??
    generateBackground(stream('background'), palette, [hairColor, hatColor])

  const backgroundReference = typeof background === 'string' ? background : background.from
  const shirtColor = normalizeColor(
    provided.shirtColor,
    pickColor(stream('shirt-color'), palette.shirts, [hairColor, hatColor], backgroundReference),
  )

  return {
    seed,
    palette: paletteName,
    background,
    skin,
    hair,
    hairColor,
    highlight: provided.highlight ?? weightedPick(stream('highlight'), HIGHLIGHT_WEIGHTS),
    hat,
    hatColor,
    ears: oneOf(provided.ears, EAR_SIZES) ?? weightedPick(stream('ears'), EAR_WEIGHTS),
    eyes: oneOf(provided.eyes, EYE_STYLES) ?? weightedPick(stream('eyes'), EYE_WEIGHTS),
    brows: oneOf(provided.brows, BROW_STYLES) ?? weightedPick(stream('brows'), BROW_WEIGHTS),
    glasses:
      oneOf(provided.glasses, GLASSES_STYLES) ?? weightedPick(stream('glasses'), GLASSES_WEIGHTS),
    nose: oneOf(provided.nose, NOSE_STYLES) ?? weightedPick(stream('nose'), NOSE_WEIGHTS),
    mouth: oneOf(provided.mouth, MOUTH_STYLES) ?? weightedPick(stream('mouth'), MOUTH_WEIGHTS),
    shirt,
    shirtColor,
    shape: oneOf(provided.shape, SHAPES) ?? 'circle',
  }
}
