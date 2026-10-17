import type { ReactElement } from 'react'
import { HEAD_PATH } from '../head'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

const ROTATE = 'rotate(-9 108.9 128.9)'

export function Stubble({ color = '#171921', uid }: ArtProps): ReactElement {
  const clipId = `${uid}-head-stubble`
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} transform="translate(43.75 20) scale(0.5625)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g transform={ROTATE}>
          <path
            fill={color}
            opacity="0.18"
            fillRule="evenodd"
            d="M62 118c-2 34 10 66 38 84 28-18 40-50 38-84-8 12-20 18-38 18s-30-6-38-18Z M92 120c0 16 6 24 14 24s14-8 14-24c-6 8-22 8-28 0Z"
          />
        </g>
      </g>
    </>
  )
}
