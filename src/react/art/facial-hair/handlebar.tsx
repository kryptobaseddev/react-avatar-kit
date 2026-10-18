import type { ReactElement } from 'react'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Handlebar({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <FaceLayer>
      <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
        <path d="M116 180c-9-8-17-7-21 1-2 4-1 7 2 9" />
        <path d="M116 180c9-8 17-7 21 1 2 4 1 7-2 9" />
      </g>
    </FaceLayer>
  )
}
