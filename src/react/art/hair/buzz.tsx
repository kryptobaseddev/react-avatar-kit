import type { ReactElement } from 'react'
import { FaceLayer } from './../facial-hair/face-layer'
import { HEAD_PATH } from '../head'
import type { ArtProps } from '../types'

export function HairBuzz({ color = '#171921', uid }: ArtProps): ReactElement {
  const clipId = `${uid}-head-buzz`
  return (
    <FaceLayer>
      <defs>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path fill={color} d="M-20 -20H220V72C170 58 140 52 116 52C92 52 62 58 20 72Z" />
      </g>
    </FaceLayer>
  )
}
