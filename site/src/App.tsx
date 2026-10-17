import { useMemo, useRef, useState } from 'react'
import type { AvatarConfig, AvatarOptions } from '../../src/index'
import { Avatar, createAvatar, palettes } from '../../src/index'
import { Editor } from './Editor'
import type { AvatarKey } from './options'
import { downloadPng } from './png'
import { VisualMatrix } from './VisualMatrix'

const GALLERY_SEEDS = [
  'ada',
  'grace',
  'linus',
  'margaret',
  'radia',
  'vint',
  'guido',
  'sophie',
  'hannah',
  'keaton',
  'kryptobaseddev',
  'react-avatar-kit',
]

const INSTALL = 'npm install react-avatar-kit'
const QUICK_START = `import { Avatar } from 'react-avatar-kit'

<Avatar seed="${'user@example.com'}" size={64} />`

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10)
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="button button--ghost button--small"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function App() {
  const isMatrix = new URLSearchParams(window.location.search).has('matrix')
  return isMatrix ? <VisualMatrix /> : <Studio />
}

function Studio() {
  const [seed, setSeed] = useState('keaton')
  const [overrides, setOverrides] = useState<AvatarOptions>({})
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const config: AvatarConfig = useMemo(
    () => createAvatar({ ...overrides, seed }),
    [overrides, seed],
  )

  const update = (key: AvatarKey, value: AvatarOptions[AvatarKey]) => {
    setOverrides((previous) => ({ ...previous, [key]: value }))
  }

  const shuffle = () => {
    setSeed(randomSeed())
    setOverrides({})
  }

  const reset = () => {
    setSeed('keaton')
    setOverrides({})
  }

  const exportPng = async () => {
    const svg = previewRef.current?.querySelector('svg')
    if (!svg) return
    setDownloading(true)
    setError(null)
    try {
      await downloadPng(svg, `avatar-${config.seed}.png`, 1024)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not export the PNG')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="app">
      <a className="skip-link" href="#editor">
        Skip to the editor
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="react-avatar-kit home">
          <span className="brand__mark" aria-hidden="true">
            <Avatar seed="react-avatar-kit" size={28} shape="rounded" />
          </span>
          <span className="brand__name">react-avatar-kit</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#gallery">Gallery</a>
          <a href="#adopt">Install</a>
          <a href="#api">API</a>
          <a
            className="button button--ghost button--small"
            href="https://github.com/kryptobaseddev/react-avatar-kit"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__intro">
            <p className="eyebrow">Zero dependencies · React 18 + 19 · RSC ready</p>
            <h1>
              One seed in.
              <br />
              One memorable avatar out.
            </h1>
            <p className="lede">
              A deterministic avatar system for React. No runtime dependencies, no client JavaScript
              if you do not want it. Drop it into any app and every user gets a face that never
              changes.
            </p>
            <div className="install">
              <code>{INSTALL}</code>
              <CopyButton value={INSTALL} label="Copy install command" />
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-card__glow" aria-hidden="true" />
            <div className="preview-card__avatar" ref={previewRef} data-testid="avatar-preview">
              <Avatar config={config} size={240} alt={`Avatar for ${config.seed}`} />
            </div>
            <div className="preview-card__controls">
              <label className="seed-field">
                <span>Seed</span>
                <input
                  type="text"
                  value={seed}
                  data-testid="seed-input"
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(event) => setSeed(event.target.value)}
                />
              </label>
              <div className="preview-card__actions">
                <button type="button" className="button" data-testid="shuffle" onClick={shuffle}>
                  Shuffle
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  data-testid="download-png"
                  onClick={exportPng}
                  disabled={downloading}
                >
                  {downloading ? 'Exporting…' : 'Download PNG'}
                </button>
              </div>
              {error ? (
                <p className="error" data-testid="download-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section id="editor" className="editor-shell" aria-label="Avatar editor">
          <Editor
            config={config}
            onChange={update}
            onBackgroundMode={(mode) => {
              if (mode === 'gradient') {
                update('background', {
                  from: typeof config.background === 'string' ? config.background : '#7C5CFF',
                  to: '#FF7A8A',
                  angle: 45,
                })
              } else {
                update(
                  'background',
                  typeof config.background === 'string'
                    ? config.background
                    : config.background.from,
                )
              }
            }}
            onReset={reset}
          />
        </section>

        <section className="gallery" id="gallery" aria-labelledby="gallery-title">
          <div className="section-head">
            <h2 id="gallery-title">Same seed, same face. Forever.</h2>
            <p>
              Click a seed to load it into the studio. Nothing is stored, everything is derived.
            </p>
          </div>
          <div className="gallery__row">
            {GALLERY_SEEDS.map((item) => (
              <button
                key={item}
                type="button"
                className="gallery__item"
                aria-label={`Use seed ${item}`}
                onClick={() => {
                  setSeed(item)
                  setOverrides({})
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <Avatar seed={item} size={84} shape="rounded" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="adopt" id="adopt" aria-labelledby="adopt-title">
          <div className="section-head">
            <h2 id="adopt-title">Two lines. That is the integration.</h2>
            <p>
              No provider, no CSS import, no fonts, no build plugin. The component renders to a
              single SVG and works on the server.
            </p>
          </div>
          <div className="code-card">
            <div className="code-card__head">
              <span>App.tsx</span>
              <CopyButton value={QUICK_START} label="Copy quick start" />
            </div>
            <pre>
              <code>{QUICK_START}</code>
            </pre>
          </div>
          <ul className="features">
            <li>
              <strong>Deterministic</strong>
              <span>Per-field seeding keeps avatars stable across server and client.</span>
            </li>
            <li>
              <strong>Zero dependencies</strong>
              <span>Only React as a peer. Nothing else ships to your bundle.</span>
            </li>
            <li>
              <strong>Server first</strong>
              <span>No hooks, no effects. Renders in React Server Components.</span>
            </li>
            <li>
              <strong>Yours to theme</strong>
              <span>
                {Object.keys(palettes).length} palettes and every colour overridable per avatar.
              </span>
            </li>
          </ul>
        </section>

        <section className="api" id="api" aria-labelledby="api-title">
          <div className="section-head">
            <h2 id="api-title">Small surface, sharp edges filed off.</h2>
            <p>Three entry points, one config object, no ambient magic.</p>
          </div>
          <div className="api__grid">
            <article className="api-card">
              <h3>&lt;Avatar /&gt;</h3>
              <p>The component. Pass a seed, get an SVG. Pass a config for exact control.</p>
              <code>{'<Avatar seed="ada" size={64} alt="Ada" />'}</code>
            </article>
            <article className="api-card">
              <h3>createAvatar()</h3>
              <p>
                Returns a JSON-serialisable config you can store in your database and render again
                later.
              </p>
              <code>{"const config = createAvatar('ada')"}</code>
            </article>
            <article className="api-card">
              <h3>avatarToSvg()</h3>
              <p>Server-side string output for Open Graph images, emails and canvas pipelines.</p>
              <code>{"avatarToSvg('ada', { size: 512 })"}</code>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          MIT © 2026 Keaton Hoskins. Illustration geometry derived from the Avatar Illustration
          System by @Micah.
        </p>
        <nav aria-label="Footer">
          <a href="https://github.com/kryptobaseddev/react-avatar-kit">GitHub</a>
          <a href="https://www.npmjs.com/package/react-avatar-kit">npm</a>
          <a href="https://github.com/kryptobaseddev/react-avatar-kit/blob/main/NOTICE.md">
            Notice
          </a>
        </nav>
      </footer>
    </div>
  )
}
