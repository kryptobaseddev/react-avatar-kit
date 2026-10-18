import type { ReactElement } from 'react'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Handlebar({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <FaceLayer>
      <path
        fill={color}
        d="M116 184C104 175 92 178 92 189c0 8 6 14 12 16 4-10 8-14 12-16 4 2 8 6 12 16 6-2 12-8 12-16 0-11-12-14-24-5Z"
      />
    </FaceLayer>
  )
}
