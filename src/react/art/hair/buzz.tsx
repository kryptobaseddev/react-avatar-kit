import type { ReactElement } from 'react'
import { HEAD_PATH } from '../head'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

export function HairBuzz({ color = '#171921', uid }: ArtProps): ReactElement {
  const clipId = `${uid}-head-buzz`
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} transform="translate(43.75 20) scale(0.5625)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path fill={color} d="M-40 -40H240V78C170 66 135 60 100 60C65 60 30 66 -40 78Z" />
      </g>
    </>
  )
}
