import type { ReactElement } from 'react'
import { HEAD_PATH } from '../head'
import type { ArtProps } from '../types'
import { FaceLayer } from './face-layer'

export function Beard({ color = '#171921', uid }: ArtProps): ReactElement {
  const clipId = `${uid}-head-beard`
  return (
    <FaceLayer>
      <defs>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          fill={color}
          d="M94 178c5-10 13-10 18-2 2 2 6 2 8 0 5-8 13-8 18 2-6 9-14 11-20 5-1-1-3-1-4 0-6 6-14 4-20-5Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M24 150C40 186 70 182 100 182L132 182C162 182 192 186 208 150L208 340L24 340Z M71 186C71 210 88 218 116 218C144 218 161 210 161 186C144 195 88 195 71 186Z"
        />
      </g>
    </FaceLayer>
  )
}
