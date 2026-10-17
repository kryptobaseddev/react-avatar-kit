import type { ReactElement } from 'react'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Moustache({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <FaceLayer>
      <path
        fill={color}
        d="M94 185c5-10 13-10 18-2 2 2 6 2 8 0 5-8 13-8 18 2-6 9-14 11-20 5-1-1-3-1-4 0-6 6-14 4-20-5Z"
      />
    </FaceLayer>
  )
}
