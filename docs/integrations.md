# Integration notes

What has actually been run against the published artifact, and what that implies.

## Verified

| Target | How it was checked | Result |
| --- | --- | --- |
| **Next.js 16.4.2, App Router** | Packed the tarball, installed it in a fresh app, rendered `<Avatar seed="ada@example.com" size={96} alt="Ada" />` and `<Avatar config={createAvatar('…')} />` from `app/page.tsx` (no `"use client"`), ran `next build` and `next start`. | Build succeeds; `/` prerenders as a static server component; the served HTML contains `<svg … role="img" aria-label="Ada">`. |
| **WebKit 27.2 (Safari engine)** | Rendered a six-avatar set (long hair, beanie, beanie + glasses, turban, mohawk two-tone, gradient and transparent canvases) under Playwright WebKit and Chromium at 360 px. | Visually identical: nested SVGs, masks, clip paths and gradients all resolve the same. |
| **Vite 8 + React 19.3** | The playground in `site/` imports the source directly and is built by Vite. | Builds, runs, e2e 9/9. |
| **React 18/19 client render** | `jsdom` + `createRoot` + `flushSync` mounts `<Avatar seed size alt />` in a throwaway project per React version. | Renders the SVG with the expected viewBox, width and accessible name. |
| **react-dom/server (SSR)** | `scripts/check-ssr.mjs` renders through `react-dom/server` and loads the package under the `react-server` export condition. | No hooks, no `react-dom` in the client entry. |
| **React 18 and 19 consumers** | `scripts/check-consumer.mjs` installs the packed tarball into throwaway projects and renders + typechecks. | Renders identically; declarations resolve under `bundler`, `node16`, and strict `skipLibCheck: false`. |
| **CommonJS** | `scripts/check-api.mjs` requires every entry point. | `react-avatar-kit`, `/core` and `/server` all resolve. |

## What makes it portable

- **One SVG, no CSS.** There is no stylesheet to import and no global styles. Sizing comes
  from the `size` prop, `className` or `style`.
- **No hooks.** The component calls no React hook, so it works in a Server Component, in a
  client component, and in `renderToStaticMarkup` without a boundary.
- **No browser APIs at import time.** The `server` subpath is the only place that imports
  `react-dom/server`, and it is never pulled in by the browser entry.
- **Deterministic ids.** SVG mask/clip ids are derived from the config, so server and client
  markup match and hydration is quiet.
- **`sideEffects: false`.** Bundlers can drop everything you do not import; the `/core` entry
  is a measured 4.9 kB gzip with no illustration markup.

## Not separately verified

Remix / React Router 7, TanStack Start, Astro islands, Expo web and plain `createRoot` apps
were not run in this repository. They consume the same standard React component surface, so
they are expected to work; the entries above are the evidence-backed set.
