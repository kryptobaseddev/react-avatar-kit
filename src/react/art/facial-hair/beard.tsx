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
          fillRule="evenodd"
          d="M24 150C40 186 70 182 100 182L132 182C162 182 192 186 208 150L208 340L24 340Z M99 186C99 200 107 206 116 206C125 206 133 200 133 186C127 193 105 193 99 186Z"
        />
      </g>
    </FaceLayer>
  )
}
