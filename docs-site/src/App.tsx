import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { Avatar, createAvatar } from '../../src/index'
import { buildOgSvg, downloadBlob, svgToPng } from './og'
import searchIndex from './search-index.json'

interface Entry {
  kind: 'export' | 'type' | 'part' | 'palette'
  title: string
  value: string
  text: string
}

const entries = searchIndex.entries as Entry[]

const EXAMPLES = {
  next: {
    label: 'Next.js',
    code: `// app/page.tsx — React Server Component, no "use client"
import { Avatar, createAvatar } from 'react-avatar-kit'

export default function Page() {
  const config = createAvatar('ada@example.com')
  return (
    <main>
      <Avatar seed="ada@example.com" size={80} alt="Ada" />
      <Avatar config={config} shape="rounded" />
    </main>
  )
}`,
  },
  vite: {
    label: 'Vite',
    code: `import { createRoot } from 'react-dom/client'
import { Avatar } from 'react-avatar-kit'

createRoot(document.getElementById('root')!).render(
  <Avatar seed="ada@example.com" size={80} alt="Ada" />,
)`,
  },
  router: {
    label: 'React Router 7',
    code: `import { Avatar, createAvatar } from 'react-avatar-kit'

export async function loader() {
  return { config: createAvatar('ada@example.com') }
}

export default function Route({ loaderData }: { loaderData: { config: ReturnType<typeof createAvatar> } }) {
  return <Avatar config={loaderData.config} size={80} alt="Ada" />
}`,
  },
  remix: {
    label: 'Remix',
    code: `// Remix v2 shares its component model with React Router 7;
// this is the same route module used in the React Router example.
import { Avatar, createAvatar } from 'react-avatar-kit'

export function loader() {
  return { config: createAvatar('ada@example.com') }
}

export default function RemixRoute({ loaderData }: any) {
  return <Avatar config={loaderData.config} size={80} alt="Ada" />
}`,
  },
} as const

type ExampleKey = keyof typeof EXAMPLES

export function App(): ReactElement {
  const [query, setQuery] = useState('')
  const [example, setExample] = useState<ExampleKey>('next')
  const [demoSeed, setDemoSeed] = useState('og@example.com')

  const config = useMemo(() => createAvatar(demoSeed), [demoSeed])
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return entries
      .filter((entry) => `${entry.title} ${entry.text}`.toLowerCase().includes(needle))
      .slice(0, 12)
  }, [query])

  const exportOg = async (format: 'svg' | 'png') => {
    const source = document.querySelector<SVGSVGElement>('[data-testid="og-avatar"] svg')
    if (!source) return
    const markup = buildOgSvg(source, config.seed)
    if (format === 'svg') {
      downloadBlob(new Blob([markup], { type: 'image/svg+xml' }), 'avatar-og.svg')
      return
    }
    const png = await svgToPng(markup, 1200, 630)
    downloadBlob(png, 'avatar-og.png')
  }

  return (
    <div className="docs">
      <header className="docs__header">
        <a className="docs__brand" href="../">
          <Avatar seed="react-avatar-kit" size={26} shape="rounded" />
          <span>react-avatar-kit</span>
          <span className="docs__tag">docs</span>
        </a>
        <nav aria-label="Docs">
          <a href="#install">Install</a>
          <a href="#api">API</a>
          <a href="#examples">Examples</a>
          <a href="#og">OG image</a>
          <a href="../">Playground</a>
        </nav>
      </header>

      <search className="docs__search">
        <label htmlFor="docs-search">Search the API, parts and palettes</label>
        <input
          id="docs-search"
          data-testid="docs-search"
          type="search"
          placeholder="Try “beard”, “createAvatar”, “neon”…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <ul className="docs__results" data-testid="docs-results">
            {results.length === 0 ? <li>No matches for “{query}”.</li> : null}
            {results.map((entry) => (
              <li key={`${entry.kind}-${entry.value}`}>
                <span className="docs__kind">{entry.kind}</span>
                <strong>{entry.title}</strong>
              </li>
            ))}
          </ul>
        ) : null}
      </search>

      <main className="docs__main">
        <section id="install" aria-labelledby="install-title">
          <h1 id="install-title">react-avatar-kit docs</h1>
          <p>
            Deterministic, zero-dependency avatars for React 18 and 19. Install it, pass a seed,
            ship a face.
          </p>
          <pre>
            <code>npm install react-avatar-kit</code>
          </pre>
          <pre>
            <code>{`import { Avatar } from 'react-avatar-kit'\n<Avatar seed="ada@example.com" size={64} />`}</code>
          </pre>
        </section>

        <section id="api" aria-labelledby="api-title">
          <h2 id="api-title">API reference</h2>
          <p>Every public export and every part or palette value, generated from source.</p>
          <ul className="docs__api">
            {entries
              .filter((entry) => entry.kind === 'export' || entry.kind === 'type')
              .map((entry) => (
                <li key={entry.value}>
                  <span className="docs__kind">{entry.kind}</span>
                  <code>{entry.title}</code>
                </li>
              ))}
          </ul>
          <h3>Parts and palettes</h3>
          <ul className="docs__api docs__api--compact">
            {entries
              .filter((entry) => entry.kind === 'part' || entry.kind === 'palette')
              .map((entry) => (
                <li key={`${entry.kind}-${entry.title}`}>
                  <span className="docs__kind">{entry.kind}</span>
                  <code>{entry.value}</code>
                </li>
              ))}
          </ul>
        </section>

        <section id="examples" aria-labelledby="examples-title">
          <h2 id="examples-title">Framework examples</h2>
          <p>Four runnable apps live in the repository; this is the shape of each.</p>
          <div className="docs__tabs" role="tablist" aria-label="Framework examples">
            {(Object.keys(EXAMPLES) as ExampleKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                className="docs__tab"
                aria-selected={example === key}
                data-testid={`example-tab-${key}`}
                onClick={() => setExample(key)}
              >
                {EXAMPLES[key].label}
              </button>
            ))}
          </div>
          <pre className="docs__code" data-testid="example-code">
            <code>{EXAMPLES[example].code}</code>
          </pre>
        </section>

        <section id="og" aria-labelledby="og-title">
          <h2 id="og-title">OG-image demo</h2>
          <p>
            Compose a share card from the same SVG the component renders. On the server, use{' '}
            <code>avatarToSvg()</code> for the same output without a DOM.
          </p>
          <div className="docs__og" data-testid="og-avatar">
            <Avatar config={config} size={120} alt={`Avatar for ${config.seed}`} />
            <label>
              Seed
              <input value={demoSeed} onChange={(event) => setDemoSeed(event.target.value)} />
            </label>
            <div className="docs__og-actions">
              <button type="button" data-testid="og-download-svg" onClick={() => exportOg('svg')}>
                Download OG SVG
              </button>
              <button type="button" data-testid="og-download-png" onClick={() => exportOg('png')}>
                Download OG PNG
              </button>
            </div>
          </div>
          <pre>
            <code>{`import { avatarToSvg } from 'react-avatar-kit/server'\n\nconst og = avatarToSvg('ada@example.com', { size: 512, alt: 'Ada' })`}</code>
          </pre>
        </section>

        <section id="guides" aria-labelledby="guides-title">
          <h2 id="guides-title">Guides</h2>
          <ul>
            <li>
              <a href="https://github.com/kryptobaseddev/react-avatar-kit/blob/main/docs/api.md">
                Full API and migration reference
              </a>
            </li>
            <li>
              <a href="https://github.com/kryptobaseddev/react-avatar-kit/blob/main/docs/integrations.md">
                Verified framework integrations
              </a>
            </li>
            <li>
              <a href="https://github.com/kryptobaseddev/react-avatar-kit#readme">README</a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="docs__footer">
        <span>MIT © 2026 Keaton Hoskins</span>
        <a href="https://www.npmjs.com/package/react-avatar-kit">npm</a>
        <a href="https://github.com/kryptobaseddev/react-avatar-kit">GitHub</a>
      </footer>
    </div>
  )
}
