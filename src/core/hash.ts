/**
 * Deterministic hashing.
 *
 * `createRng` is seeded with a string and returns a uniform generator in `[0, 1)`.
 * The same string always produces the same stream on every platform, which is what
 * makes seeded avatars stable across server and browser.
 */

function xmur3(input: string): () => number {
  let hash = 1779033703 ^ input.length
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    hash ^= hash >>> 16
    return hash >>> 0
  }
}

function sfc32(a: number, b: number, c: number, d: number): () => number {
  return () => {
    a >>>= 0
    b >>>= 0
    c >>>= 0
    d >>>= 0
    let t = (a + b) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    d = (d + 1) | 0
    t = (t + d) | 0
    c = (c + t) | 0
    return (t >>> 0) / 4294967296
  }
}

/** Creates a deterministic generator for a seed string. */
export function createRng(seed: string): () => number {
  const next = xmur3(seed)
  return sfc32(next(), next(), next(), next())
}

/** Picks an index in `[0, length)` from a generator. */
export function randomIndex(rng: () => number, length: number): number {
  return Math.min(length - 1, Math.floor(rng() * length))
}

/** Picks one value from a non-empty list. */
export function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[randomIndex(rng, values.length)] as T
}

/** Picks from `[value, weight]` pairs using a generator. */
export function weightedPick<T>(rng: () => number, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let cursor = rng() * total
  for (const [value, weight] of entries) {
    cursor -= weight
    if (cursor <= 0) return value
  }
  return entries[entries.length - 1] as T
}

/** Short, stable hex digest used to namespace SVG ids. */
export function stableId(value: string): string {
  const next = xmur3(value)
  let id = ''
  for (let index = 0; index < 2; index += 1) {
    id += next().toString(16).padStart(8, '0')
  }
  return id
}
