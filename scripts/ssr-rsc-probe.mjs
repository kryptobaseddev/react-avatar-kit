/**
 * Runs with `--conditions=react-server` to prove the avatar entry is loadable inside
 * a React Server Component environment: no react-dom, no client-only imports, and a
 * component that can be executed without a renderer (which also proves it has no hooks).
 */
import { createRscProbe } from './ssr-probe-lib.mjs'

createRscProbe()
