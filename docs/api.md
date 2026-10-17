# react-avatar-kit API

Version 1.0.0 · React 18 and 19 · zero runtime dependencies.

## Install

```sh
npm install react-avatar-kit
```

## Two-line adoption

```tsx
import { Avatar } from 'react-avatar-kit'
<Avatar seed="ada@example.com" size={64} />
```

That is the whole integration. `seed` can be a user id, an email, a username or any
stable string; the same seed always renders the same avatar, on the server and in the
browser. `size` accepts a number (pixels) or any CSS length.

## `<Avatar />`

```tsx
import { Avatar } from 'react-avatar-kit'

<Avatar seed="ada@example.com" size={96} shape="rounded" alt="Ada Lovelace" />
```

Renders a single, self-contained `<svg>`. It uses no hooks, no context and no
client-only APIs, so it is valid in a React Server Component, in `react-dom/server`
and in a plain React 18/19 client tree.

### Props

```ts
interface AvatarProps extends AvatarOptions {
  config?: AvatarConfig
  size?: number | string
  alt?: string
  title?: string
  className?: string
  style?: CSSProperties
  id?: string
}
```

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `seed` | `string` | `"default"` | Deterministic seed. Any stable string. |
| `config` | `AvatarConfig` | – | A full config from `createAvatar()`. Explicit props win over it. |
| `size` | `number \| string` | `64` | Width and height. Numbers are pixels; strings may be any CSS length. |
| `shape` | `"circle" \| "rounded" \| "square" \| "none"` | `"circle"` | Corner treatment of the avatar canvas. |
| `alt` | `string` | – | Accessible name. When present the SVG is `role="img"` with a `<title>`; when absent the avatar is decorative (`aria-hidden="true"`). |
| `title` | `string` | – | Native SVG tooltip, independent of `alt`. |
| `className` | `string` | – | Passed to the root `<svg>`. |
| `style` | `CSSProperties` | – | Merged onto the root `<svg>` after `width`/`height`. |
| `id` | `string` | – | DOM id for the root `<svg>`. |

Every field of `AvatarOptions` may also be passed directly as a prop, so
`<Avatar seed="ada" hair="mohawk" shirt="hoodie" />` works.

```ts
function Avatar(props: AvatarProps): ReactElement
```

## `createAvatar()`

```ts
function createAvatar(input?: string | AvatarOptions): AvatarConfig
```

- `createAvatar("ada@example.com")` → the deterministic avatar for that seed.
- `createAvatar({ seed: "ada", hair: "mohawk" })` → the same avatar with one override.
- `createAvatar()` → a random avatar. It returns its generated `seed`, so you can store
  the result and render it again later.

The result is a plain, JSON-serialisable object that can be stored in a database,
put in a cache, or sent over the wire. Spread it into the component:

```tsx
const config = createAvatar('ada@example.com')
<Avatar {...config} size={96} />
```

### Options

```ts
interface AvatarOptions {
  seed?: string
  palette?: PaletteName
  background?: AvatarColor | AvatarGradient
  skin?: AvatarColor
  hair?: HairStyle
  hairColor?: AvatarColor
  highlight?: boolean
  hat?: HatStyle
  hatColor?: AvatarColor
  ears?: 'small' | 'big'
  eyes?: EyeStyle
  brows?: BrowStyle
  glasses?: GlassesStyle
  nose?: NoseStyle
  mouth?: MouthStyle
  shirt?: ShirtStyle
  shirtColor?: AvatarColor
  shape?: Shape
}
```

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `seed` | `string` | `"default"` | Drives every field that is not overridden. |
| `palette` | `"default" \| "pastel" \| "vivid" \| "mono"` | `"default"` | Colour family used for generated colours. Explicit colours always win. |
| `background` | `string \| AvatarGradient` | generated | CSS colour or `{ from, to, angle? }` gradient. |
| `skin` | `string` | generated | Any CSS colour. |
| `hair` | `"short" \| "thick" \| "mohawk" \| "long" \| "bob" \| "none"` | generated | Only drawn when `hat` is `"none"`, so hats keep their silhouette. |
| `hairColor` | `string` | generated | Any CSS colour. |
| `highlight` | `boolean` | `false` | Adds the lighter second tone to the mohawk artwork. Shirts always keep their built-in fold shading. |
| `hat` | `"none" \| "beanie" \| "turban"` | generated | Usually `"none"`. A hat replaces the hair silhouette; `hair` stays in the config. |
| `hatColor` | `string` | generated | Any CSS colour. |
| `ears` | `"small" \| "big"` | generated | |
| `eyes` | `"round" \| "oval" \| "smile"` | generated | |
| `brows` | `"straight" \| "arched"` | generated | Independent of hair. |
| `glasses` | `"none" \| "round" \| "square"` | generated | Usually `"none"`. |
| `nose` | `"short" \| "round" \| "long"` | generated | |
| `mouth` | `"smile" \| "laugh" \| "peace"` | generated | |
| `shirt` | `"tee" \| "hoodie" \| "polo"` | generated | |
| `shirtColor` | `string` | generated | Any CSS colour. |
| `shape` | `"circle" \| "rounded" \| "square" \| "none"` | `"circle"` | Stored in the config so `<Avatar {...config} />` round-trips. |

`AvatarColor` is a `string` holding any CSS colour (`#rgb`, `#rrggbb`, `rgb()`,
`oklch()`, a named colour, …). Invalid values fall back to the palette colour.

### Determinism contract

- The same `seed` and options produce a deeply equal config on every call, on every
  platform, and across versions of react-avatar-kit.
- Adding an override never changes the untouched fields: each field is drawn from its
  own seeded stream.
- Seeds are stable data, not art direction. A future major version may change the
  artwork behind a seed; it will not silently change a version-1 seed.
- No seed means the fixed seed `"default"`, not randomness, so server and client HTML
  always match.

## `palettes`

```ts
const palettes: Record<PaletteName, Palette>

interface Palette {
  name: PaletteName
  skins: string[]
  hair: string[]
  hats: string[]
  shirts: string[]
  backgrounds: string[]
  gradients: AvatarGradient[]
  accents: string[]
}
```

Read-only catalogue of the colours used for generated avatars. Useful for building
editors and theme pickers. `createAvatar({ palette: "pastel", seed: "ada" })` uses it;
individual colours can be overridden afterwards.

## `avatarToSvg()`

```ts
interface AvatarToSvgOptions {
  size?: number
  alt?: string
  title?: string
  shape?: Shape
}

// import { avatarToSvg } from 'react-avatar-kit/server'
function avatarToSvg(
  input?: string | AvatarConfig | AvatarOptions,
  options?: AvatarToSvgOptions
): string
```

Renders a standalone SVG document as a string, for Open Graph images, email templates,
static site generation or a canvas/PNG pipeline. It lives on the `server` subpath so the
browser entry never pulls in `react-dom/server`.

```ts
import { avatarToSvg } from 'react-avatar-kit/server'
const markup = avatarToSvg('ada@example.com', { size: 512, alt: 'Ada' })
```

## Subpath exports

| Specifier | Contents |
| --- | --- |
| `react-avatar-kit` | `Avatar`, `createAvatar`, `palettes`, all public types |
| `react-avatar-kit/core` | `createAvatar`, `palettes`, all public types — no React import |
| `react-avatar-kit/server` | `avatarToSvg` for non-browser rendering |

## Public exports

`src/index.ts` is the entire public surface of the component entry point:

```ts
export { Avatar } from './react/avatar'
export { createAvatar } from './core/create-avatar'
export { palettes } from './core/palettes'

export type { AvatarProps } from './react/avatar'
export type {
  AvatarColor,
  AvatarConfig,
  AvatarGradient,
  AvatarOptions,
  BrowStyle,
  EarSize,
  EyeStyle,
  GlassesStyle,
  HairStyle,
  HatStyle,
  MouthStyle,
  NoseStyle,
  Palette,
  PaletteName,
  Shape,
  ShirtStyle,
} from './core/types'
```

`avatarToSvg` is the fourth public runtime function and lives on the
`react-avatar-kit/server` subpath.

Type signatures:

```ts
type Shape = 'circle' | 'rounded' | 'square' | 'none'
type HairStyle = 'short' | 'thick' | 'mohawk' | 'long' | 'bob' | 'none'
type HatStyle = 'none' | 'beanie' | 'turban'
type EyeStyle = 'round' | 'oval' | 'smile'
type BrowStyle = 'straight' | 'arched'
type GlassesStyle = 'none' | 'round' | 'square'
type NoseStyle = 'short' | 'round' | 'long'
type MouthStyle = 'smile' | 'laugh' | 'peace'
type ShirtStyle = 'tee' | 'hoodie' | 'polo'
type PaletteName = 'default' | 'pastel' | 'vivid' | 'mono'
type EarSize = 'small' | 'big'
type AvatarColor = string
interface AvatarGradient { from: string; to: string; angle?: number }

interface AvatarConfig extends Required<Omit<AvatarOptions, 'background'>> {
  background: AvatarColor | AvatarGradient
}
```

## Styling

The component ships no CSS. `className`, `style` and `size` cover layout, and every
colour is a plain CSS colour, so a design system can theme avatars directly:

```tsx
<Avatar seed={user.id} size="2.5rem" shape="rounded" className="ring-2 ring-white" />
```

## Server rendering and React Server Components

`<Avatar />` renders deterministically from props alone. It needs no `"use client"`
boundary, no effects and no layout measurement, so it can be rendered inside a React
Server Component, streamed with `renderToPipeableStream`, or pre-rendered to HTML.

```tsx
// app/page.tsx — a React Server Component, no "use client"
import { Avatar } from 'react-avatar-kit'

export default function Page() {
  return <Avatar seed="ada@example.com" size={80} alt="Ada" />
}
```

## Migrating from the old package

The old `<Avatar {...genConfig(seed)} />` pattern becomes one line:

```diff
- import Avatar, { genConfig } from 'react-nice-avatar'
- <Avatar {...genConfig('hi@example.com')} style={{ width: 64, height: 64 }} />
+ import { Avatar } from 'react-avatar-kit'
+ <Avatar seed="hi@example.com" size={64} />
```

| Old | New |
| --- | --- |
| `genConfig(seed)` | `createAvatar(seed)` |
| `genConfig({ ... })` | `createAvatar({ seed, ... })` |
| `shape` prop | `shape` prop (`none` added) |
| `sex` | removed; hair, brows and everything else are independent |
| `hairStyle: "normal"` | `hair: "short"` |
| `hairStyle: "womanLong"` | `hair: "long"` |
| `hairStyle: "womanShort"` | `hair: "bob"` |
| `eyeStyle: "circle"` | `eyes: "round"` |
| `eyeBrowStyle` | `brows: "straight" \| "arched"` |
| `glassesStyle` | `glasses` |
| `noseStyle` | `nose` |
| `mouthStyle` | `mouth` |
| `hatStyle` | `hat` |
| `shirtStyle: "short" \| "hoody"` | `shirt: "tee" \| "hoodie"` |
| `bgColor` + `isGradient` | `background: string \| { from, to, angle? }` |
| `hairColorRandom` | `highlight` |
| `faceColor` | `skin` |
| `earSize` | `ears` |

Seeded output is intentionally not compatible with the old library: the generator was
rebuilt (independent per-field streams, contrast-aware colour picking). Pass an explicit
`config` if you need to preserve stored avatars exactly.

## Versioning

- `1.x` keeps the export names, option names, and the determinism contract.
- The `exports` map is part of the contract: `react-avatar-kit`, `/core` and `/server`
  stay resolvable from both ESM and CommonJS.
- Dropping a React major is a major version.
