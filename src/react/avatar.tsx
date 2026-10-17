import type { CSSProperties, ReactElement } from 'react'
import { createAvatar } from '../core/create-avatar'
import { stableId } from '../core/hash'
import type { AvatarConfig, AvatarOptions, Shape } from '../core/types'
import { CANVAS, CORNER_RADIUS } from './layout'
import { AvatarArt } from './parts'

export interface AvatarProps extends AvatarOptions {
  /** A full config from `createAvatar()`. Explicit props win over it. */
  config?: AvatarConfig
  /** Width and height. Numbers are pixels; strings may be any CSS length. */
  size?: number | string
  /** Accessible name. Omit for a decorative avatar. */
  alt?: string
  /** Native SVG tooltip. */
  title?: string
  className?: string
  style?: CSSProperties
  id?: string
}

function backgroundAngle(background: AvatarConfig['background']): number {
  if (typeof background === 'string') return 45
  return background.angle ?? 45
}

function ShapeClip({ id, shape }: { id: string; shape: Shape }): ReactElement | null {
  if (shape === 'circle') {
    return (
      <clipPath id={id}>
        <circle cx={CANVAS / 2} cy={CANVAS / 2} r={CANVAS / 2} />
      </clipPath>
    )
  }
  if (shape === 'rounded') {
    return (
      <clipPath id={id}>
        <rect width={CANVAS} height={CANVAS} rx={CORNER_RADIUS} ry={CORNER_RADIUS} />
      </clipPath>
    )
  }
  return null
}

/**
 * Renders a deterministic avatar as a single, self-contained SVG.
 *
 * No hooks, no context, no client-only APIs: safe in React Server Components and in
 * `react-dom/server`.
 */
export function Avatar(props: AvatarProps): ReactElement {
  const { config, size = 64, alt, title, className, style, id, ...options } = props
  const resolved = createAvatar({ ...(config ?? {}), ...options })
  const uid = `ark-${stableId(JSON.stringify(resolved))}`
  const clipId = `${uid}-shape`
  const gradientId = `${uid}-bg`
  const dimension = typeof size === 'number' ? size : size
  const clipped = resolved.shape === 'circle' || resolved.shape === 'rounded'
  const showBackground = resolved.shape !== 'none'
  const gradient =
    typeof resolved.background === 'string'
      ? null
      : {
          from: resolved.background.from,
          to: resolved.background.to,
          angle: backgroundAngle(resolved.background),
        }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CANVAS} ${CANVAS}`}
      width={dimension}
      height={dimension}
      id={id}
      className={className}
      role={alt ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      focusable="false"
      style={{ display: 'block', width: dimension, height: dimension, ...style }}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <ShapeClip id={clipId} shape={resolved.shape} />
        {gradient ? (
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={CANVAS}
            y2={0}
            gradientTransform={`rotate(${gradient.angle} ${CANVAS / 2} ${CANVAS / 2})`}
          >
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
        ) : null}
      </defs>
      <g clipPath={clipped ? `url(#${clipId})` : undefined}>
        {showBackground ? (
          <rect
            width={CANVAS}
            height={CANVAS}
            fill={gradient ? `url(#${gradientId})` : (resolved.background as string)}
          />
        ) : null}
        <AvatarArt config={resolved} uid={uid} />
      </g>
    </svg>
  )
}
