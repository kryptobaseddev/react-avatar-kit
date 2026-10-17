import type { ReactElement, ReactNode } from 'react'
import { brighten } from '../core/color'
import type { AvatarConfig } from '../core/types'
import { BrowsArched, viewBox as browsArchedViewBox } from './art/brows/arched'
import { BrowsStraight, viewBox as browsStraightViewBox } from './art/brows/straight'
import { EarBig, viewBox as earBigViewBox } from './art/ear/big'
import { EarSmall, viewBox as earSmallViewBox } from './art/ear/small'
import { EyesOval, viewBox as eyesOvalViewBox } from './art/eyes/oval'
import { EyesRound, viewBox as eyesRoundViewBox } from './art/eyes/round'
import { EyesSmile, viewBox as eyesSmileViewBox } from './art/eyes/smile'
import { Face, viewBox as faceViewBox } from './art/face'
import { GlassesRound, viewBox as glassesRoundViewBox } from './art/glasses/round'
import { GlassesSquare, viewBox as glassesSquareViewBox } from './art/glasses/square'
import { HairBob, viewBox as hairBobViewBox } from './art/hair/bob'
import { HairLong, viewBox as hairLongViewBox } from './art/hair/long'
import { HairMohawk, viewBox as hairMohawkViewBox } from './art/hair/mohawk'
import { HairShort, viewBox as hairShortViewBox } from './art/hair/short'
import { HairThick, viewBox as hairThickViewBox } from './art/hair/thick'
import { HatBeanie, viewBox as hatBeanieViewBox } from './art/hat/beanie'
import { HatTurban, viewBox as hatTurbanViewBox } from './art/hat/turban'
import { MouthLaugh, viewBox as mouthLaughViewBox } from './art/mouth/laugh'
import { MouthPeace, viewBox as mouthPeaceViewBox } from './art/mouth/peace'
import { MouthSmile, viewBox as mouthSmileViewBox } from './art/mouth/smile'
import { NoseLong, viewBox as noseLongViewBox } from './art/nose/long'
import { NoseRound, viewBox as noseRoundViewBox } from './art/nose/round'
import { NoseShort, viewBox as noseShortViewBox } from './art/nose/short'
import { ShirtHoodie, viewBox as shirtHoodieViewBox } from './art/shirt/hoodie'
import { ShirtPolo, viewBox as shirtPoloViewBox } from './art/shirt/polo'
import { ShirtTee, viewBox as shirtTeeViewBox } from './art/shirt/tee'
import { type Box, layout } from './layout'

function Part({
  box,
  viewBox,
  children,
}: {
  box: Box
  viewBox: string
  children: ReactNode
}): ReactElement {
  return (
    <svg
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function HairArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement | null {
  const colorRandom = config.highlight
  switch (config.hair) {
    case 'thick':
      return (
        <Part box={layout.hair.thick} viewBox={hairThickViewBox}>
          <HairThick color={config.hairColor} colorRandom={colorRandom} uid={uid} />
        </Part>
      )
    case 'mohawk':
      return (
        <Part box={layout.hair.mohawk} viewBox={hairMohawkViewBox}>
          <HairMohawk color={config.hairColor} colorRandom={colorRandom} uid={uid} />
        </Part>
      )
    case 'long':
      return (
        <Part box={layout.hair.long} viewBox={hairLongViewBox}>
          <HairLong color={config.hairColor} uid={uid} />
        </Part>
      )
    case 'bob':
      return (
        <Part box={layout.hair.bob} viewBox={hairBobViewBox}>
          <HairBob color={config.hairColor} uid={uid} />
        </Part>
      )
    case 'short':
      return (
        <Part box={layout.hair.short} viewBox={hairShortViewBox}>
          <HairShort color={config.hairColor} uid={uid} />
        </Part>
      )
    default:
      return null
  }
}

function HatArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement | null {
  switch (config.hat) {
    case 'beanie':
      return (
        <Part box={layout.hat.beanie} viewBox={hatBeanieViewBox}>
          <HatBeanie color={config.hatColor} uid={uid} />
        </Part>
      )
    case 'turban':
      return (
        <Part box={layout.hat.turban} viewBox={hatTurbanViewBox}>
          <HatTurban color={config.hatColor} uid={uid} />
        </Part>
      )
    default:
      return null
  }
}

function BrowsArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  if (config.brows === 'arched') {
    return (
      <Part box={layout.details.brows} viewBox={browsArchedViewBox}>
        <BrowsArched uid={uid} />
      </Part>
    )
  }
  return (
    <Part box={layout.details.brows} viewBox={browsStraightViewBox}>
      <BrowsStraight uid={uid} />
    </Part>
  )
}

function EyesArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  switch (config.eyes) {
    case 'round':
      return (
        <Part box={layout.details.eyes.round} viewBox={eyesRoundViewBox}>
          <EyesRound uid={uid} />
        </Part>
      )
    case 'smile':
      return (
        <Part box={layout.details.eyes.smile} viewBox={eyesSmileViewBox}>
          <EyesSmile uid={uid} />
        </Part>
      )
    default:
      return (
        <Part box={layout.details.eyes.oval} viewBox={eyesOvalViewBox}>
          <EyesOval uid={uid} />
        </Part>
      )
  }
}

function GlassesArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement | null {
  switch (config.glasses) {
    case 'round':
      return (
        <Part box={layout.details.glasses.round} viewBox={glassesRoundViewBox}>
          <GlassesRound uid={uid} />
        </Part>
      )
    case 'square':
      return (
        <Part box={layout.details.glasses.square} viewBox={glassesSquareViewBox}>
          <GlassesSquare uid={uid} />
        </Part>
      )
    default:
      return null
  }
}

function EarArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  if (config.ears === 'big') {
    return (
      <Part box={layout.details.ears.big} viewBox={earBigViewBox}>
        <EarBig color={config.skin} uid={uid} />
      </Part>
    )
  }
  return (
    <Part box={layout.details.ears.small} viewBox={earSmallViewBox}>
      <EarSmall color={config.skin} uid={uid} />
    </Part>
  )
}

function NoseArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  switch (config.nose) {
    case 'long':
      return (
        <Part box={layout.details.nose} viewBox={noseLongViewBox}>
          <NoseLong uid={uid} />
        </Part>
      )
    case 'round':
      return (
        <Part box={layout.details.nose} viewBox={noseRoundViewBox}>
          <NoseRound uid={uid} />
        </Part>
      )
    default:
      return (
        <Part box={layout.details.nose} viewBox={noseShortViewBox}>
          <NoseShort uid={uid} />
        </Part>
      )
  }
}

function MouthArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  switch (config.mouth) {
    case 'laugh':
      return (
        <Part box={layout.details.mouth.laugh} viewBox={mouthLaughViewBox}>
          <MouthLaugh uid={uid} />
        </Part>
      )
    case 'peace':
      return (
        <Part box={layout.details.mouth.peace} viewBox={mouthPeaceViewBox}>
          <MouthPeace uid={uid} />
        </Part>
      )
    default:
      return (
        <Part box={layout.details.mouth.smile} viewBox={mouthSmileViewBox}>
          <MouthSmile uid={uid} />
        </Part>
      )
  }
}

function ShirtArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  const lightColor = brighten(config.shirtColor, 0.14)
  switch (config.shirt) {
    case 'hoodie':
      return (
        <Part box={layout.shirt.hoodie} viewBox={shirtHoodieViewBox}>
          <ShirtHoodie color={config.shirtColor} lightColor={lightColor} uid={uid} />
        </Part>
      )
    case 'polo':
      return (
        <Part box={layout.shirt.polo} viewBox={shirtPoloViewBox}>
          <ShirtPolo color={config.shirtColor} lightColor={lightColor} uid={uid} />
        </Part>
      )
    default:
      return (
        <Part box={layout.shirt.tee} viewBox={shirtTeeViewBox}>
          <ShirtTee color={config.shirtColor} uid={uid} />
        </Part>
      )
  }
}

/** Draws the layered avatar inside the root canvas. */
export function AvatarArt({ config, uid }: { config: AvatarConfig; uid: string }): ReactElement {
  return (
    <>
      <Part box={layout.face} viewBox={faceViewBox}>
        <Face color={config.skin} uid={uid} />
      </Part>
      {config.hat === 'none' ? <HairArt config={config} uid={uid} /> : null}
      <HatArt config={config} uid={uid} />
      <BrowsArt config={config} uid={uid} />
      <EyesArt config={config} uid={uid} />
      <GlassesArt config={config} uid={uid} />
      <EarArt config={config} uid={uid} />
      <NoseArt config={config} uid={uid} />
      <MouthArt config={config} uid={uid} />
      <ShirtArt config={config} uid={uid} />
    </>
  )
}
