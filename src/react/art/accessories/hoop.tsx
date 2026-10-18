import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

export function HoopEarring(_props: ArtProps): ReactElement {
  const d = 'M51.5 119a5.5 5.5 0 1 0 11 0'
  return (
    <>
      <circle cx="57" cy="116" r="1.7" fill="#171921" />
      <path d={d} fill="none" stroke="#171921" strokeWidth="4.5" />
      <path d={d} fill="none" stroke="#F4D150" strokeWidth="2.4" />
    </>
  )
}
