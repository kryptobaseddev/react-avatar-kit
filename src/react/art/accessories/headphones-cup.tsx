import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

/** A single left ear cup; the band suggests the other side runs behind the head. */
export function HeadphonesCup({ color = '#506AF4' }: ArtProps): ReactElement {
  return (
    <g>
      <rect
        x="43"
        y="92"
        width="26"
        height="38"
        rx="12"
        fill={color}
        stroke="#171921"
        strokeWidth="4"
      />
      <rect
        x="49"
        y="99"
        width="12"
        height="24"
        rx="6"
        fill="#DCE3FF"
        stroke="#171921"
        strokeWidth="3.5"
      />
    </g>
  )
}
