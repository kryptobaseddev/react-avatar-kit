# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
