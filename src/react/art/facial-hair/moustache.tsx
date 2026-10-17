import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

const ROTATE = 'rotate(-9 108.9 128.9)'

export function Moustache({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <g transform={ROTATE}>
      <path
        fill={color}
        d="M97 120c3-4 7-4 9-1 1 1 2 1 3 0 2-3 6-3 9 1-3 5-7 6-10 3-1-1-2-1-3 0-3 3-7 2-8-3Z"
      />
    </g>
  )
}
