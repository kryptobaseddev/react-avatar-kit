import type { ReactElement } from 'react'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Moustache({ color = '#171921' }: ArtProps): ReactElement {
  return (
    <FaceLayer>
      <path
        fill={color}
        d="M98 181c4-6 9-6 13-1 1 1 3 1 4 0 4-5 9-5 13 1-5 7-10 9-14 4-1-1-3-1-4 0-4 5-9 3-12-4Z"
      />
    </FaceLayer>
  )
}
