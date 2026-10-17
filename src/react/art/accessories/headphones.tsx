import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

export function Headphones({ color = '#506AF4' }: ArtProps): ReactElement {
  const pad = '#DCE3FF'
  return (
    <g transform="rotate(-9 100 100)">
      <path
        d="M55 96C52 22 148 16 145 90"
        fill="none"
        stroke="#171921"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M55 96C52 22 148 16 145 90"
        fill="none"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <rect
        x="44"
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
        x="50"
        y="99"
        width="12"
        height="24"
        rx="6"
        fill={pad}
        stroke="#171921"
        strokeWidth="3.5"
      />
      <rect
        x="136"
        y="93"
        width="12"
        height="24"
        rx="6"
        fill={pad}
        stroke="#171921"
        strokeWidth="3.5"
      />
    </g>
  )
}
