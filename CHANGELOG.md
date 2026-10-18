# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.4 — 2026-10-17

### Fixed

- The mouth now renders above facial hair, so smile, laugh and peace stay readable with a
  beard; the beard opening is wide enough to leave a skin margin around the mouth.
- The full beard and stubble include a moustache above the lip.
- The `handlebar` style is redesigned as a walrus moustache: broad over the lip with ends
  drooping past the mouth corners.

## 1.1.3 — 2026-10-17

### Fixed

- Headphones now render underneath beanies and turbans.
- The headphone band ends with a gentle curve into the hair instead of a hard downward hook.
- Moustache and goatee moustache sit closer to the nose.
- Handlebar moustache is wider, reaching from cheek to cheek.
- Hoop earring sits on the earlobe rather than at the front edge of the ear.

### Added

- A Hat colour control in the playground (visible when a hat is selected); generated hat
  colours come from the palette's `hats` list and explicit `hatColor` wins.

## 1.1.2 — 2026-10-17

### Fixed

- Moustache and goatee now draw above the mouth layer with a solid lip-covering shape,
  instead of being clipped into a squiggle by the mouth artwork.
- Headphones show a single left ear cup; the band ends shorter with a downward curve into
  the hair instead of looping over the crest.
- A mohawk crest now layers over the band, so the band reads as passing underneath it.

## 1.1.1 — 2026-10-17

### Fixed

- Facial hair is now drawn in the face artwork's own coordinate space and clipped to the
  head silhouette, so beards and stubble wrap the whole jaw and the mouth opening is clean.
- The hoop earring sits at the earlobe instead of hanging below the ear.
- Over-ear headphones use a single visible band that rises from the left cup and tucks into
  the hair at the crown, with no full helmet arc.
- The buzz cut follows the skull without exposing scalp at the crown.

## 1.1.0 — 2026-10-17

### Added

- Facial hair: `moustache`, `handlebar`, `beard`, `goatee`, `stubble`.
- Accessories: `earring: "stud" | "hoop"` and `headphones: "over-ear"` with
  `headphoneColor`.
- Hair style `buzz`.
- Palettes `earth` and `neon`.
- Searchable docs site at `/docs` with an API reference, guides, framework examples and an
  OG-image demo.
- Four runnable examples: Next.js App Router, Vite, React Router 7 and a Remix-style route.

### Changed

- Library sourcemaps are no longer published; the tarball stays under 210 kB unpacked.
- README and API docs cover the new surface and link the docs site.

### Compatibility

- The new parts are opt-in. Existing seeds render byte-identically; `check:compat` locks
  the frozen fixture.

## 1.0.1 — 2026-10-17

### Changed

- Publishing now uses npm trusted publishing over OIDC from GitHub Actions, with
  provenance and no long-lived `NPM_TOKEN` secret.
- README documents both release routes and the verified framework integrations.

## 1.0.0 — 2026-10-17

First release of react-avatar-kit, a ground-up rewrite of the avatar system for React 18
and 19.

### Added

- `<Avatar />`: deterministic, hook-free SVG component that renders in React Server
  Components and through `react-dom/server`.
- `createAvatar(seed | options)`: JSON-serialisable config generator with independent
  per-field seeded streams and contrast-aware colour selection.
- `avatarToSvg()` on `react-avatar-kit/server` for Open Graph images, email and canvas
  pipelines.
- Four palettes (`default`, `pastel`, `vivid`, `mono`) and per-avatar colour overrides.
- `shape`, `size`, `alt`, `title`, `className` and `style` props.
- ESM and CommonJS builds with generated declarations and a strict `exports` map.
- Playground with live editor, seed gallery and 1024px PNG export.
- Unit, golden-seed, accessibility, SSR, consumer, end-to-end and visual regression gates.

### Changed

- Illustration geometry re-laid-out on a single 200×200 canvas with per-avatar SVG id
  namespacing.
- Public option names simplified (`hair`, `eyes`, `brows`, `hat`, `shirt`, `skin`,
  `background`); `sex` is gone, so hair and brows are independent choices.

### Removed

- Runtime dependencies (`chroma-js`, `prop-types`, `@babel/runtime`).
- The class component API, `genConfig`, `hairColorRandom`/`isGradient` flags and deep
  imports into internal part modules.
