import type { AvatarConfig, AvatarOptions } from '../../src/index'
import {
  type AvatarKey,
  browOptions,
  earOptions,
  eyeOptions,
  glassesOptions,
  gradientColors,
  hairOptions,
  hatOptions,
  mouthOptions,
  noseOptions,
  paletteOptions,
  shapeOptions,
  shirtOptions,
  solidBackground,
  toColorInput,
} from './options'

interface EditorProps {
  config: AvatarConfig
  onChange: (key: AvatarKey, value: AvatarOptions[AvatarKey]) => void
  onBackgroundMode: (mode: 'solid' | 'gradient') => void
  onReset: () => void
}

function ChipGroup<T extends string>({
  label,
  testId,
  value,
  options,
  onChange,
}: {
  label: string
  testId: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <div className="chips" data-testid={testId}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="chip"
            data-testid={`${testId}-${option}`}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorField({
  label,
  testId,
  value,
  onChange,
}: {
  label: string
  testId: string
  value: string
  onChange: (value: string) => void
}) {
  const safe = toColorInput(value)
  return (
    <label className="color-field">
      <span className="color-field__label">{label}</span>
      <span className="color-field__control">
        <input
          type="color"
          value={safe}
          data-testid={testId}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
        />
        <code>{safe}</code>
      </span>
    </label>
  )
}

export function Editor({ config, onChange, onBackgroundMode, onReset }: EditorProps) {
  const gradient = typeof config.background !== 'string'
  const colors = gradientColors(config)
  const background = gradient ? null : solidBackground(config)

  return (
    <aside className="editor" aria-label="Avatar editor">
      <div className="editor__head">
        <div>
          <h2>Design it</h2>
          <p>Every change is one property. No config files, no CSS.</p>
        </div>
        <button type="button" className="button button--ghost" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="editor__grid">
        <div className="editor__column">
          <section className="editor__section">
            <ChipGroup
              label="Shape"
              testId="shape"
              value={config.shape}
              options={shapeOptions}
              onChange={(value) => onChange('shape', value)}
            />
            <ChipGroup
              label="Palette"
              testId="palette"
              value={config.palette}
              options={paletteOptions}
              onChange={(value) => onChange('palette', value)}
            />
          </section>

          <section className="editor__section">
            <ChipGroup
              label="Shirt"
              testId="shirt"
              value={config.shirt}
              options={shirtOptions}
              onChange={(value) => onChange('shirt', value)}
            />
            <ColorField
              label="Shirt color"
              testId="shirt-color"
              value={config.shirtColor}
              onChange={(value) => onChange('shirtColor', value)}
            />
          </section>

          <section className="editor__section">
            <div className="field">
              <span className="field__label">Background</span>
              <div className="chips" data-testid="background-mode">
                <button
                  type="button"
                  className="chip"
                  aria-pressed={!gradient}
                  data-testid="background-solid"
                  onClick={() => onBackgroundMode('solid')}
                >
                  solid
                </button>
                <button
                  type="button"
                  className="chip"
                  aria-pressed={gradient}
                  data-testid="background-gradient"
                  onClick={() => onBackgroundMode('gradient')}
                >
                  gradient
                </button>
              </div>
            </div>
            {gradient ? (
              <>
                <ColorField
                  label="Gradient from"
                  testId="background-from"
                  value={colors.from}
                  onChange={(value) =>
                    onChange('background', {
                      from: value,
                      to: colors.to,
                      angle:
                        typeof config.background === 'string'
                          ? 45
                          : (config.background.angle ?? 45),
                    })
                  }
                />
                <ColorField
                  label="Gradient to"
                  testId="background-to"
                  value={colors.to}
                  onChange={(value) =>
                    onChange('background', {
                      from: colors.from,
                      to: value,
                      angle:
                        typeof config.background === 'string'
                          ? 45
                          : (config.background.angle ?? 45),
                    })
                  }
                />
              </>
            ) : (
              <ColorField
                label="Background color"
                testId="background"
                value={background ?? '#000000'}
                onChange={(value) => onChange('background', value)}
              />
            )}
          </section>
        </div>

        <div className="editor__column">
          <section className="editor__section">
            <ChipGroup
              label="Hair"
              testId="hair"
              value={config.hair}
              options={hairOptions}
              onChange={(value) => onChange('hair', value)}
            />
            <ChipGroup
              label="Hat"
              testId="hat"
              value={config.hat}
              options={hatOptions}
              onChange={(value) => onChange('hat', value)}
            />
            <ColorField
              label="Hair color"
              testId="hair-color"
              value={config.hairColor}
              onChange={(value) => onChange('hairColor', value)}
            />
            <label className="toggle">
              <input
                type="checkbox"
                checked={config.highlight}
                data-testid="highlight"
                onChange={(event) => onChange('highlight', event.target.checked)}
              />
              <span>Two-tone highlight</span>
            </label>
          </section>
        </div>

        <div className="editor__column">
          <section className="editor__section">
            <ChipGroup
              label="Eyes"
              testId="eyes"
              value={config.eyes}
              options={eyeOptions}
              onChange={(value) => onChange('eyes', value)}
            />
            <ChipGroup
              label="Brows"
              testId="brows"
              value={config.brows}
              options={browOptions}
              onChange={(value) => onChange('brows', value)}
            />
            <ChipGroup
              label="Glasses"
              testId="glasses"
              value={config.glasses}
              options={glassesOptions}
              onChange={(value) => onChange('glasses', value)}
            />
            <ChipGroup
              label="Nose"
              testId="nose"
              value={config.nose}
              options={noseOptions}
              onChange={(value) => onChange('nose', value)}
            />
            <ChipGroup
              label="Mouth"
              testId="mouth"
              value={config.mouth}
              options={mouthOptions}
              onChange={(value) => onChange('mouth', value)}
            />
            <ChipGroup
              label="Ears"
              testId="ears"
              value={config.ears}
              options={earOptions}
              onChange={(value) => onChange('ears', value)}
            />
            <ColorField
              label="Skin tone"
              testId="skin"
              value={config.skin}
              onChange={(value) => onChange('skin', value)}
            />
          </section>
        </div>
      </div>
    </aside>
  )
}
