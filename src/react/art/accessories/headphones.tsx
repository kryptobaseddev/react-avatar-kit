import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

/**
 * One visible band side: it rises from the left cup and tucks into the hair at the
 * crown, as if the other side runs behind the head.
 */
export function Headphones({ color = '#506AF4' }: ArtProps): ReactElement {
  return (
    <g>
      <path
        d="M56 92C50 40 82 28 118 30"
        fill="none"
        stroke="#171921"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M56 92C50 40 82 28 118 30"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
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
        x="130"
        y="86"
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
      <rect
        x="136"
        y="93"
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
