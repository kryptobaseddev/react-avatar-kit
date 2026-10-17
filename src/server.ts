import { createElement, type ReactElement } from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { createAvatar } from './core/create-avatar'
import type { AvatarConfig, AvatarOptions, Shape } from './core/types'
import { Avatar, type AvatarProps } from './react/avatar'

export interface AvatarToSvgOptions {
  size?: number
  alt?: string
  title?: string
  shape?: Shape
}

interface ServerRenderer {
  renderToStaticMarkup(element: ReactElement): string
}

/**
 * `react-dom/server` ships a CommonJS namespace on Node's `react-server` condition,
 * so resolve the renderer defensively instead of relying on named-export detection.
 */
function getRenderer(): ServerRenderer {
  const namespace = ReactDOMServer as unknown as Partial<ServerRenderer> & {
    default?: ServerRenderer
  }
  const render = namespace.renderToStaticMarkup ?? namespace.default?.renderToStaticMarkup
  if (!render) throw new Error('react-dom/server does not expose renderToStaticMarkup')
  return { renderToStaticMarkup: render }
}

/**
 * Renders an avatar as a standalone SVG document string.
 *
 * Useful for Open Graph images, emails, static generation and canvas/PNG pipelines.
 * Lives on the `server` subpath so the browser entry never imports `react-dom/server`.
 */
export function avatarToSvg(
  input?: string | AvatarConfig | AvatarOptions,
  options: AvatarToSvgOptions = {},
): string {
  const base =
    typeof input === 'string' ? createAvatar(input) : createAvatar(input === undefined ? {} : input)
  const props: AvatarProps = {
    ...base,
    size: options.size ?? 256,
  }
  if (options.alt !== undefined) props.alt = options.alt
  if (options.title !== undefined) props.title = options.title
  if (options.shape !== undefined) props.shape = options.shape
  return getRenderer().renderToStaticMarkup(createElement(Avatar, props))
}
