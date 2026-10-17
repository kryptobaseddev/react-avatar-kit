import type { ReactElement } from 'react'
import { HEAD_PATH } from '../head'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Goatee({ color = '#171921', uid }: ArtProps): ReactElement {
  const clipId = `${uid}-head-goatee`
  return (
    <FaceLayer>
      <defs>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill={color}>
        <path d="M98 181c4-6 9-6 13-1 1 1 3 1 4 0 4-5 9-5 13 1-5 7-10 9-14 4-1-1-3-1-4 0-4 5-9 3-12-4Z" />
        <path d="M101 214c2 26 9 40 15 44 6-4 13-18 15-44-8 10-22 10-30 0Z" />
      </g>
    </FaceLayer>
  )
}
