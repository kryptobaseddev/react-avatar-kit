import type { ReactElement } from 'react'
import { HEAD_PATH } from '../head'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

const ROTATE = 'rotate(-9 108.9 128.9)'

export function Goatee({ color = '#171921', uid }: ArtProps): ReactElement {
  const clipId = `${uid}-head-goatee`
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} transform="translate(43.75 20) scale(0.5625)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g transform={ROTATE} fill={color}>
          <path d="M97 120c3-4 7-4 9-1 1 1 2 1 3 0 2-3 6-3 9 1-3 5-7 6-10 3-1-1-2-1-3 0-3 3-7 2-8-3Z" />
          <path d="M92 140c1 20 7 30 14 34 7-4 13-14 14-34-6 8-22 8-28 0Z" />
        </g>
      </g>
    </>
  )
}
