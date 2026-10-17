import { describe, expect, it } from 'vitest'
import { createAvatar } from '../src/core/create-avatar'
import { avatarToSvg } from '../src/server'

describe('avatarToSvg', () => {
  it('returns a standalone svg document', () => {
    const markup = avatarToSvg('ada')
    expect(markup.startsWith('<svg')).toBe(true)
    expect(markup.endsWith('</svg>')).toBe(true)
    expect(markup).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(markup).toContain('viewBox="0 0 200 200"')
    expect(markup).toContain('width="256"')
  })

  it('is deterministic for the same input', () => {
    expect(avatarToSvg('ada')).toBe(avatarToSvg('ada'))
    expect(avatarToSvg('ada')).not.toBe(avatarToSvg('grace'))
  })

  it('accepts a full config and per-call options', () => {
    const config = createAvatar({ seed: 'ada', hair: 'mohawk' })
    const markup = avatarToSvg(config, { size: 512, alt: 'Ada', title: 'Ada', shape: 'square' })
    expect(markup).toContain('width="512"')
    expect(markup).toContain('aria-label="Ada"')
    expect(markup).toContain('<title>Ada</title>')
    expect(markup).not.toContain('-shape"')
  })

  it('escapes user-controlled labels', () => {
    const markup = avatarToSvg('ada', { alt: '<script>alert(1)</script>' })
    expect(markup).not.toContain('<script>')
    expect(markup).toContain('&lt;script&gt;')
  })

  it('renders without a seed argument', () => {
    const markup = avatarToSvg()
    expect(markup.startsWith('<svg')).toBe(true)
  })
})
