import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

export function HoopEarring(_props: ArtProps): ReactElement {
  return (
    <>
      <circle cx="56" cy="121" r="1.6" fill="#171921" />
      <path d="M51.5 123.5a5.5 5.5 0 1 0 9 0" fill="none" stroke="#171921" strokeWidth="4.5" />
      <path d="M51.5 123.5a5.5 5.5 0 1 0 9 0" fill="none" stroke="#F4D150" strokeWidth="2.4" />
    </>
  )
}
