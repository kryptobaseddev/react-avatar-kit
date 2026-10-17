import type { ReactElement } from 'react'
import type { ArtProps } from '../types'

export const viewBox = '0 0 200 200'

/**
 * The visible band rises from the left cup and ends early, curving down into the hair
 * at the crown instead of looping over it.
 */
export function HeadphonesBand({ color = '#506AF4' }: ArtProps): ReactElement {
  const d = 'M56 92C54 50 72 42 96 52'
  return (
    <g>
      <path d={d} fill="none" stroke="#171921" strokeWidth="9" strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}
