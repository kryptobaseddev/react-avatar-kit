import type { AvatarOptions, PaletteName, Shape } from '../../src/index'
import { Avatar } from '../../src/index'

const SHAPES: Shape[] = ['circle', 'rounded', 'square', 'none']
const SIZES = [32, 48, 64, 96, 128]
const PALETTES: PaletteName[] = ['default', 'pastel', 'vivid', 'mono']
const GALLERY = ['ada', 'grace', 'linus', 'margaret', 'radia', 'vint', 'guido', 'sophie']

const PART_CASES: { label: string; options: AvatarOptions }[] = []

for (const hair of ['short', 'thick', 'mohawk', 'long', 'bob', 'none'] as const) {
  PART_CASES.push({ label: `hair:${hair}`, options: { hair } })
}
for (const hat of ['none', 'beanie', 'turban'] as const) {
  PART_CASES.push({ label: `hat:${hat}`, options: { hat, hair: 'none' } })
}
for (const eyes of ['round', 'oval', 'smile'] as const) {
  PART_CASES.push({ label: `eyes:${eyes}`, options: { eyes } })
}
for (const brows of ['straight', 'arched'] as const) {
  PART_CASES.push({ label: `brows:${brows}`, options: { brows } })
}
for (const glasses of ['none', 'round', 'square'] as const) {
  PART_CASES.push({ label: `glasses:${glasses}`, options: { glasses } })
}
for (const nose of ['short', 'round', 'long'] as const) {
  PART_CASES.push({ label: `nose:${nose}`, options: { nose } })
}
for (const mouth of ['smile', 'laugh', 'peace'] as const) {
  PART_CASES.push({ label: `mouth:${mouth}`, options: { mouth } })
}
for (const shirt of ['tee', 'hoodie', 'polo'] as const) {
  PART_CASES.push({ label: `shirt:${shirt}`, options: { shirt } })
}
for (const ears of ['small', 'big'] as const) {
  PART_CASES.push({ label: `ears:${ears}`, options: { ears } })
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="matrix__cell" aria-label={label}>
      {children}
    </figure>
  )
}

/**
 * Deterministic rendering matrix used by the Playwright visual regression project.
 * Visit `/?matrix=1`.
 */
export function VisualMatrix() {
  return (
    <div className="matrix" data-testid="visual-matrix">
      <section data-testid="matrix-shapes" aria-label="Shapes">
        <div className="matrix__grid">
          {SHAPES.map((shape) => (
            <Cell key={shape} label={shape}>
              <Avatar seed="matrix-shape" size={96} shape={shape} />
            </Cell>
          ))}
        </div>
      </section>

      <section data-testid="matrix-sizes" aria-label="Sizes">
        <div className="matrix__grid matrix__grid--sizes">
          {SIZES.map((size) => (
            <Cell key={size} label={`${size}px`}>
              <Avatar seed="matrix-size" size={size} />
            </Cell>
          ))}
        </div>
      </section>

      <section data-testid="matrix-parts" aria-label="Parts">
        <div className="matrix__grid">
          {PART_CASES.map((item, index) => (
            <Cell key={item.label} label={item.label}>
              <Avatar seed={`matrix-part-${index}`} size={88} {...item.options} />
            </Cell>
          ))}
        </div>
      </section>

      <section data-testid="matrix-combinations" aria-label="Shape × size">
        <div className="matrix__grid matrix__grid--combinations">
          {SHAPES.flatMap((shape) =>
            SIZES.map((size) => (
              <Cell key={`${shape}-${size}`} label={`${shape}:${size}`}>
                <Avatar seed={`matrix-combo-${shape}`} shape={shape} size={size} />
              </Cell>
            )),
          )}
        </div>
      </section>

      <section data-testid="matrix-palettes" aria-label="Palettes">
        <div className="matrix__grid">
          {PALETTES.flatMap((palette) =>
            GALLERY.map((seed) => (
              <Cell key={`${palette}-${seed}`} label={`${palette}:${seed}`}>
                <Avatar seed={seed} palette={palette} size={72} />
              </Cell>
            )),
          )}
        </div>
      </section>
    </div>
  )
}
