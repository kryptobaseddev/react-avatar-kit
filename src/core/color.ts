/**
 * Colour helpers used by the generator and the artwork.
 *
 * Everything degrades gracefully: if a value is not a hex colour (for example an
 * `oklch()` string supplied by a consumer) the original value is returned untouched.
 */

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const SAFE_COLOR = /^[#a-zA-Z0-9(),.%\s/+-]+$/
const MAX_COLOR_LENGTH = 64

/** True when the value is a plausible, injection-free CSS colour string. */
export function isColor(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_COLOR_LENGTH &&
    SAFE_COLOR.test(value)
  )
}

/** Returns the colour when it is valid, otherwise the fallback. */
export function normalizeColor(value: unknown, fallback: string): string {
  return isColor(value) ? value.trim() : fallback
}

interface Rgb {
  r: number
  g: number
  b: number
}

/** Parses `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa` into 0-255 channels. */
export function toRgb(color: string): Rgb | null {
  if (!HEX_COLOR.test(color)) return null
  const hex = color.slice(1)
  const expand = (char: string) => Number.parseInt(char + char, 16)
  if (hex.length === 3 || hex.length === 4) {
    return { r: expand(hex[0] as string), g: expand(hex[1] as string), b: expand(hex[2] as string) }
  }
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function toHex(channel: number): string {
  return Math.max(0, Math.min(255, Math.round(channel)))
    .toString(16)
    .padStart(2, '0')
}

/** Mixes a colour towards white by `amount` (0-1). Non-hex colours pass through. */
export function brighten(color: string, amount = 0.18): string {
  const rgb = toRgb(color)
  if (!rgb) return color
  const mix = Math.max(0, Math.min(1, amount))
  return `#${toHex(rgb.r + (255 - rgb.r) * mix)}${toHex(rgb.g + (255 - rgb.g) * mix)}${toHex(
    rgb.b + (255 - rgb.b) * mix,
  )}`
}

/** Mixes a colour towards black by `amount` (0-1). Non-hex colours pass through. */
export function darken(color: string, amount = 0.18): string {
  const rgb = toRgb(color)
  if (!rgb) return color
  const mix = Math.max(0, Math.min(1, amount))
  return `#${toHex(rgb.r * (1 - mix))}${toHex(rgb.g * (1 - mix))}${toHex(rgb.b * (1 - mix))}`
}

/** Perceived luminance, 0 (black) to 1 (white). Returns null for non-hex colours. */
export function luminance(color: string): number | null {
  const rgb = toRgb(color)
  if (!rgb) return null
  const channel = (value: number) => {
    const srgb = value / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
}

/** Absolute luminance distance between two colours, or null when incomparable. */
export function contrast(a: string, b: string): number | null {
  const left = luminance(a)
  const right = luminance(b)
  if (left === null || right === null) return null
  return Math.abs(left - right)
}
