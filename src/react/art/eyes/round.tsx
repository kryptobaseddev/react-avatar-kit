import type { ReactElement } from 'react'

import type { ArtProps } from '../types'

export const viewBox = '0 0 96 48'

export function EyesRound(_props: ArtProps): ReactElement {
  return (
    <>
      <ellipse
        cx="16.1171"
        cy="28.9268"
        rx="9"
        ry="10"
        transform="rotate(-6.77646 16.1171 28.9268)"
        fill="black"
      />
      <ellipse
        cx="80.1486"
        cy="18.9231"
        rx="9"
        ry="10"
        transform="rotate(-6.27568 80.1486 18.9231)"
        fill="black"
      />
    </>
  )
}
