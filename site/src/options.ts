import type { AvatarConfig, AvatarOptions, PaletteName, Shape } from '../../src/index'

export const shapeOptions: readonly Shape[] = ['circle', 'rounded', 'square', 'none']
export const paletteOptions: readonly PaletteName[] = [
  'default',
  'pastel',
  'vivid',
  'mono',
  'earth',
  'neon',
]
export const hairOptions = ['short', 'thick', 'mohawk', 'long', 'bob', 'buzz', 'none'] as const
export const hatOptions = ['none', 'beanie', 'turban'] as const
export const eyeOptions = ['round', 'oval', 'smile'] as const
export const browOptions = ['straight', 'arched'] as const
export const glassesOptions = ['none', 'round', 'square'] as const
export const noseOptions = ['short', 'round', 'long'] as const
export const mouthOptions = ['smile', 'laugh', 'peace'] as const
export const earOptions = ['small', 'big'] as const
export const shirtOptions = ['tee', 'hoodie', 'polo'] as const
export const facialHairOptions = [
  'none',
  'moustache',
  'handlebar',
  'beard',
  'goatee',
  'stubble',
] as const
export const earringOptions = ['none', 'stud', 'hoop'] as const
export const headphoneOptions = ['none', 'over-ear'] as const

export type AvatarKey = keyof AvatarOptions

export function solidBackground(config: AvatarConfig): string {
  return typeof config.background === 'string' ? config.background : config.background.from
}

export function gradientColors(config: AvatarConfig): { from: string; to: string } {
  if (typeof config.background === 'string') {
    return { from: config.background, to: '#ffffff' }
  }
  return { from: config.background.from, to: config.background.to }
}

/** Color inputs only accept `#rrggbb`; anything else falls back to a safe value. */
export function toColorInput(value: string, fallback = '#000000'): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}
