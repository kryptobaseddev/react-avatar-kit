# react-avatar-kit

Deterministic, zero-dependency avatars for React 18 and 19. One seed in, one memorable
avatar out — the same face on the server, in the browser, and in your database.

![react-avatar-kit: one seed in, one memorable avatar out](https://raw.githubusercontent.com/kryptobaseddev/react-avatar-kit/main/docs/hero.png)

[![npm version](https://img.shields.io/npm/v/react-avatar-kit.svg)](https://www.npmjs.com/package/react-avatar-kit)
[![CI](https://github.com/kryptobaseddev/react-avatar-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/kryptobaseddev/react-avatar-kit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/react-avatar-kit.svg)](./LICENSE)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](./package.json)

**[Live playground →](https://kryptobaseddev.github.io/react-avatar-kit/)** — edit an avatar,
copy the seed, export a PNG.

## Install

```sh
npm install react-avatar-kit
```

React 18 or 19 is the only peer dependency. `react-dom` is optional and only needed for
`avatarToSvg()` on the server.

## Use it in two lines

```tsx
import { Avatar } from 'react-avatar-kit'
<Avatar seed="ada@example.com" size={64} />
```

That is the whole integration. The seed can be a user id, an email, a username, a slug —
any stable string. The same seed always renders the same avatar.

```tsx
<Avatar seed={user.id} size={96} shape="rounded" alt={user.name} />
```

- `size` takes a number (pixels) or any CSS length (`"2.5rem"`, `"100%"`).
- `alt` makes the SVG accessible (`role="img"`); omit it and the avatar is decorative.
- `shape` is `circle` (default), `rounded`, `square` or `none` for a transparent canvas.

## Why this exists

- **Deterministic.** Each attribute is drawn from its own seeded stream, so a seed
  produces an identical config on every platform, in every render, forever.
- **Zero runtime dependencies.** No colour library, no prop-types, no babel runtime.
  React is the only peer.
- **Server first.** No hooks, no effects, no `useId`, no client boundary. `<Avatar />`
  works inside a React Server Component and in `react-dom/server`.
- **One SVG.** No nested divs, no CSS file, no font, no image request. It scales cleanly
  to any size and exports to PNG.
- **Data, not art direction.** `createAvatar()` returns a plain JSON object you can store
  in Postgres, put in a session, or serve from an API.

## API at a glance

| Export | What it does |
| --- | --- |
| `<Avatar />` | Renders a config or a seed as one self-contained SVG. |
| `createAvatar(seed \| options)` | Returns a fully resolved, JSON-serialisable config. |
| `palettes` | The colour catalogues behind generated avatars. |
| `avatarToSvg()` | `react-avatar-kit/server` — standalone SVG string for OG images and email. |

Full signatures, every option and the migration table: **[docs/api.md](./docs/api.md)**.

## Recipes

### Store an avatar in your database

```ts
import { createAvatar } from 'react-avatar-kit'

const config = createAvatar(user.id)
await db.users.update({ where: { id: user.id }, data: { avatar: config } })

// Later, anywhere:
<Avatar config={user.avatar} size={48} />
```

### Give people control

```tsx
<Avatar seed={user.id} hair="mohawk" hat="beanie" shirt="hoodie" glasses="round" />
```

Every option is a plain prop. The [playground](https://kryptobaseddev.github.io/react-avatar-kit/)
is a live editor for the same surface.

### Pick a palette

```tsx
<Avatar seed={user.id} palette="pastel" />
```

`default`, `pastel`, `vivid` and `mono` ship in the box. Individual colours
(`skin`, `hairColor`, `hatColor`, `shirtColor`, `background`) override the palette.

### Open Graph images and emails

```ts
import { avatarToSvg } from 'react-avatar-kit/server'

const svg = avatarToSvg('ada@example.com', { size: 512, alt: 'Ada' })
```

Returns a standalone SVG document — no DOM, no browser, no canvas.

### Next.js App Router

```tsx
// app/page.tsx — a React Server Component, no "use client"
import { Avatar } from 'react-avatar-kit'

export default function Page() {
  return <Avatar seed="ada@example.com" size={80} alt="Ada" />
}
```

### Plain SSR

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { Avatar } from 'react-avatar-kit'

const html = renderToStaticMarkup(<Avatar seed="ada@example.com" size={64} />)
```

## Requirements

Framework notes (Next.js App Router, Vite, edge runtimes): [docs/integrations.md](./docs/integrations.md).

- React `>=18 <20`
- Any modern bundler. ESM and CommonJS are both first class; TypeScript declarations
  ship for both.
- Node `>=18` if you use the `server` subpath.

## Migrating an old seeded avatar

The API was rebuilt rather than patched, so prop names and seeded output are intentionally
different. The [migration table](./docs/api.md#migrating-from-the-old-package) maps every
old option to its new name; the playground makes re-picking a look quick.

## Development

```sh
npm install
npm run dev           # playground at http://localhost:5173
npm test              # unit, golden-seed and accessibility tests
npm run typecheck
npm run lint
npm run build         # ESM + CJS + .d.ts via tsdown
npm run build:site    # playground build
npm run check:api     # public API surface, ESM and CJS
npm run check:package # tarball contents, exports, size budget
npm run check:ssr     # react-server condition + react-dom/server render
npm run check:consumer# installs the tarball under React 18 and 19
npm run test:e2e      # Playwright: playground behaviour + WCAG A/AA audit
npm run test:visual   # Playwright: visual regression matrix
npm run check:all     # every gate above, in order
```

Visual baselines live in `e2e/matrix.visual.ts-snapshots/` and are platform-independent.
Update them deliberately with `npm run test:visual:update` and review the diff.

## Releasing

Publishing is a tag push, so the artifact is always built by the same workflow that
verified it.

**Route A — from this machine**

```sh
npm login                 # or: npm login --auth-type=web
npm run check:all         # every gate, in order
npm publish --access public
```

**Route B — from CI (with provenance)**

1. Create an npm granular access token with publish rights for `react-avatar-kit`
   (or configure trusted publishing for `kryptobaseddev/react-avatar-kit`).
2. Add it as the `NPM_TOKEN` repository secret (Settings → Secrets → Actions).
3. `npm version <patch|minor|major> && git push --follow-tags`.
   `publish.yml` builds, checks the tarball, and publishes with provenance.

The playground deploys from `main` through `pages.yml`; Pages must be set to
**Source: GitHub Actions** (already configured for this repository).

## License

MIT © 2026 Keaton Hoskins. The illustration geometry is derived from the Avatar
Illustration System by [@Micah](https://www.figma.com/@Micah); see [NOTICE.md](./NOTICE.md)
for the full attribution.
