import type { ReactElement } from 'react'

/** Face layer: same box and viewBox as the face artwork, so positions are exact. */
export const FACE_LAYER = {
  x: 0,
  y: 20,
  width: 200,
  height: 180,
  viewBox: '0 0 200 320',
} as const

export function FaceLayer({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <svg
      x={FACE_LAYER.x}
      y={FACE_LAYER.y}
      width={FACE_LAYER.width}
      height={FACE_LAYER.height}
      viewBox={FACE_LAYER.viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}
