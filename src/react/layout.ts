/**
 * Canvas geometry.
 *
 * The avatar is a 200×200 SVG canvas. The face stage occupies the bottom 90%, and
 * every part is a nested `<svg>` with its own viewBox, so the original illustration
 * proportions survive at any rendered size.
 */
export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export const CANVAS = 200
export const CORNER_RADIUS = 28

export const layout = {
  face: { x: 0, y: 20, width: 200, height: 180 },
  hair: {
    short: { x: -1, y: 18.2, width: 188, height: 145.8 },
    thick: { x: 0, y: 12.44, width: 187, height: 115.2 },
    mohawk: { x: -3.6, y: 12.26, width: 195.2, height: 114.3 },
    long: { x: 0, y: 23.96, width: 194, height: 180 },
    bob: { x: -1.6, y: 20, width: 184, height: 135 },
  },
  hat: {
    beanie: { x: 44, y: -14.2, width: 98, height: 153 },
    turban: { x: 31.6, y: -10.6, width: 128, height: 151.2 },
  },
  shirt: {
    tee: { x: 0, y: 157.7, width: 200, height: 46.8 },
    hoodie: { x: 0, y: 156.8, width: 196, height: 46.8 },
    polo: { x: -0.4, y: 156.8, width: 196, height: 46.8 },
  },
  details: {
    brows: { x: 6, y: 74, width: 160, height: 23.4 },
    eyes: {
      round: { x: 6, y: 86.6, width: 200, height: 21.6 },
      oval: { x: 6, y: 84.8, width: 200, height: 21.6 },
      smile: { x: 6, y: 84.8, width: 200, height: 25.2 },
    },
    glasses: {
      round: { x: 0, y: 76.7, width: 200, height: 36 },
      square: { x: 0, y: 74.9, width: 200, height: 39.6 },
    },
    ears: {
      small: { x: 45.6, y: 97.4, width: 32, height: 27 },
      big: { x: 44, y: 97.4, width: 32, height: 27 },
    },
    nose: { x: 98, y: 101, width: 20, height: 18 },
    mouth: {
      smile: { x: 60, y: 115.4, width: 100, height: 30.6 },
      laugh: { x: 60, y: 115.4, width: 100, height: 34.2 },
      peace: { x: 60, y: 115.4, width: 100, height: 34.2 },
    },
  },
} as const satisfies Record<string, unknown>
