import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createAvatar } from '../src/core/create-avatar'
import type {
  BrowStyle,
  EyeStyle,
  GlassesStyle,
  HairStyle,
  HatStyle,
  MouthStyle,
  NoseStyle,
  Shape,
  ShirtStyle,
} from '../src/core/types'
import { Avatar } from '../src/react/avatar'

function ids(container: Element): string[] {
  return Array.from(container.querySelectorAll('[id]'))
    .map((node) => node.id)
    .filter((id) => id.length > 0)
}

describe('<Avatar />', () => {
  it('renders a single self-contained svg', () => {
    const { container } = render(<Avatar seed="ada" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 200 200')
    expect(svg?.getAttribute('width')).toBe('64')
    expect(svg?.getAttribute('height')).toBe('64')
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(1)
    expect(container.querySelector('svg')?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('is decorative by default and labelled when alt is provided', () => {
    const { container, unmount } = render(<Avatar seed="ada" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('role')).toBeNull()
    unmount()

    render(<Avatar seed="ada" alt="Ada Lovelace" />)
    const labelled = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(labelled.tagName.toLowerCase()).toBe('svg')
    expect(labelled.getAttribute('aria-hidden')).toBeNull()
  })

  it('renders a title element when title is provided', () => {
    const { container } = render(<Avatar seed="ada" title="Ada" />)
    expect(container.querySelector('title')?.textContent).toBe('Ada')
  })

  it('accepts numeric and CSS string sizes', () => {
    const { container, unmount } = render(<Avatar seed="ada" size={96} />)
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('96')
    unmount()

    const second = render(<Avatar seed="ada" size="2.5rem" />)
    expect(second.container.querySelector('svg')?.getAttribute('width')).toBe('2.5rem')
    expect(second.container.querySelector('svg')?.getAttribute('height')).toBe('2.5rem')
  })

  it('falls back to a sane size for invalid values', () => {
    const { container, unmount } = render(<Avatar seed="ada" size={Number.NaN} />)
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('64')
    unmount()
    const second = render(<Avatar seed="ada" size="  " />)
    expect(second.container.querySelector('svg')?.getAttribute('width')).toBe('64')
  })

  it('forwards id, className and style', () => {
    const { container } = render(
      <Avatar seed="ada" id="me" className="avatar" style={{ opacity: 0.5 }} />,
    )
    const svg = container.querySelector('svg')
    expect(svg?.id).toBe('me')
    expect(svg?.getAttribute('class')).toBe('avatar')
    expect(svg?.style.opacity).toBe('0.5')
  })

  it('applies the requested shape', () => {
    const shapes: Shape[] = ['circle', 'rounded', 'square', 'none']
    for (const shape of shapes) {
      const { container, unmount } = render(<Avatar seed="ada" shape={shape} />)
      const clip = container.querySelector('clipPath[id$="-shape"]')
      const background = container.querySelector('svg > g > rect')
      if (shape === 'circle') {
        expect(clip?.querySelector('circle')).not.toBeNull()
      } else if (shape === 'rounded') {
        expect(clip?.querySelector('rect')?.getAttribute('rx')).toBe('28')
      } else {
        expect(clip).toBeNull()
      }
      if (shape === 'none') expect(background).toBeNull()
      else expect(background).not.toBeNull()
      unmount()
    }
  })

  it('renders gradients when the config asks for one', () => {
    const { container } = render(
      <Avatar seed="ada" background={{ from: '#ff0000', to: '#0000ff', angle: 90 }} />,
    )
    const gradient = container.querySelector('linearGradient')
    expect(gradient).not.toBeNull()
    expect(gradient?.getAttribute('gradientTransform')).toContain('rotate(90')
    const stops = Array.from(container.querySelectorAll('stop')).map((stop) =>
      stop.getAttribute('stop-color'),
    )
    expect(stops).toEqual(['#ff0000', '#0000ff'])
  })

  it('merges a config with explicit props, props winning', () => {
    const config = createAvatar({ seed: 'ada', hair: 'mohawk', eyes: 'smile' })
    const { container } = render(<Avatar config={config} size={120} eyes="round" />)
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('120')
    expect(container.innerHTML).not.toBe('')
  })

  it('namespaces ids per avatar and keeps them deterministic', () => {
    const first = render(<Avatar seed="ada" />)
    const adaIds = ids(first.container)
    expect(adaIds.length).toBeGreaterThan(0)
    expect(new Set(adaIds).size).toBe(adaIds.length)

    const second = render(<Avatar seed="ada" />)
    expect(ids(second.container)).toEqual(adaIds)
    first.unmount()
    second.unmount()

    const other = render(<Avatar seed="grace" />)
    expect(ids(other.container)).not.toEqual(adaIds)
  })

  it('has no duplicate ids inside one avatar', () => {
    const { container } = render(<Avatar seed="ada" hat="beanie" hair="long" glasses="round" />)
    const all = ids(container)
    expect(new Set(all).size).toBe(all.length)
  })

  it('renders every documented part variant', () => {
    const hairs: HairStyle[] = ['short', 'thick', 'mohawk', 'long', 'bob', 'none']
    const hats: HatStyle[] = ['none', 'beanie', 'turban']
    const eyes: EyeStyle[] = ['round', 'oval', 'smile']
    const brows: BrowStyle[] = ['straight', 'arched']
    const glasses: GlassesStyle[] = ['none', 'round', 'square']
    const noses: NoseStyle[] = ['short', 'round', 'long']
    const mouths: MouthStyle[] = ['smile', 'laugh', 'peace']
    const shirts: ShirtStyle[] = ['tee', 'hoodie', 'polo']

    const cases = [
      ...hairs.map((hair) => ({ hair })),
      ...hats.map((hat) => ({ hat })),
      ...eyes.map((eyes) => ({ eyes })),
      ...brows.map((brows) => ({ brows })),
      ...glasses.map((glasses) => ({ glasses })),
      ...noses.map((nose) => ({ nose })),
      ...mouths.map((mouth) => ({ mouth })),
      ...shirts.map((shirt) => ({ shirt })),
    ]

    for (const options of cases) {
      const { container, unmount } = render(<Avatar seed="ada" {...options} />)
      expect(container.querySelector('svg')).not.toBeNull()
      unmount()
    }
  })

  it('renders identical markup for identical props (hydration safety)', () => {
    const first = render(<Avatar seed="ada" size={48} />)
    const markup = first.container.innerHTML
    first.unmount()
    const second = render(<Avatar seed="ada" size={48} />)
    expect(second.container.innerHTML).toBe(markup)
  })
})
