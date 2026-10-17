import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

const ROTATE = 'rotate(-9 108.9 128.9)'

export function Handlebar({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <g transform={ROTATE} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
      <path d="M109 121c-4-4-8-4-11 0-2 2-1 5 1 6" />
      <path d="M109 121c4-4 8-4 11 0 2 2 1 5-1 6" />
    </g>
  )
}
