import type { ReactElement } from 'react'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Handlebar({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <FaceLayer>
      <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
        <path d="M116 182c-6-6-12-6-16 0-2 3-1 6 1 8" />
        <path d="M116 182c6-6 12-6 16 0 2 3 1 6-1 8" />
      </g>
    </FaceLayer>
  )
}
