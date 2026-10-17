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
        <path d="M94 185c5-10 13-10 18-2 2 2 6 2 8 0 5-8 13-8 18 2-6 9-14 11-20 5-1-1-3-1-4 0-6 6-14 4-20-5Z" />
        <path d="M101 222c2 24 9 36 15 40 6-4 13-16 15-40-8 9-22 9-30 0Z" />
      </g>
    </FaceLayer>
  )
}
