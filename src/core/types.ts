/** Public type surface for react-avatar-kit. */

export type Shape = 'circle' | 'rounded' | 'square' | 'none'
export type HairStyle = 'short' | 'thick' | 'mohawk' | 'long' | 'bob' | 'none'
export type HatStyle = 'none' | 'beanie' | 'turban'
export type EyeStyle = 'round' | 'oval' | 'smile'
export type BrowStyle = 'straight' | 'arched'
export type GlassesStyle = 'none' | 'round' | 'square'
export type NoseStyle = 'short' | 'round' | 'long'
export type MouthStyle = 'smile' | 'laugh' | 'peace'
export type ShirtStyle = 'tee' | 'hoodie' | 'polo'
export type EarSize = 'small' | 'big'
export type PaletteName = 'default' | 'pastel' | 'vivid' | 'mono'

/** Any CSS colour. Invalid values fall back to the generated colour. */
export type AvatarColor = string

export interface AvatarGradient {
  from: string
  to: string
  angle?: number
}

/** Every option accepted by `createAvatar()` and `<Avatar />`. All are optional. */
export interface AvatarOptions {
  /** Stable string that drives every field not overridden. */
  seed?: string
  palette?: PaletteName
  background?: AvatarColor | AvatarGradient
  skin?: AvatarColor
  hair?: HairStyle
  hairColor?: AvatarColor
  highlight?: boolean
  hat?: HatStyle
  hatColor?: AvatarColor
  ears?: EarSize
  eyes?: EyeStyle
  brows?: BrowStyle
  glasses?: GlassesStyle
  nose?: NoseStyle
  mouth?: MouthStyle
  shirt?: ShirtStyle
  shirtColor?: AvatarColor
  shape?: Shape
}

/** A fully resolved, JSON-serialisable avatar description. */
export interface AvatarConfig {
  seed: string
  palette: PaletteName
  background: AvatarColor | AvatarGradient
  skin: AvatarColor
  hair: HairStyle
  hairColor: AvatarColor
  highlight: boolean
  hat: HatStyle
  hatColor: AvatarColor
  ears: EarSize
  eyes: EyeStyle
  brows: BrowStyle
  glasses: GlassesStyle
  nose: NoseStyle
  mouth: MouthStyle
  shirt: ShirtStyle
  shirtColor: AvatarColor
  shape: Shape
}

/** Colour catalogue backing a palette. */
export interface Palette {
  name: PaletteName
  skins: string[]
  hair: string[]
  hats: string[]
  shirts: string[]
  backgrounds: string[]
  gradients: AvatarGradient[]
  accents: string[]
}
