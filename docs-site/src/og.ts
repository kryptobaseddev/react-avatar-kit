const escapeXml = (value: string): string =>
  value.replace(/[<>&'"]/g, (char) =>
    char === '<'
      ? '&lt;'
      : char === '>'
        ? '&gt;'
        : char === '&'
          ? '&amp;'
          : char === "'"
            ? '&apos;'
            : '&quot;',
  )

/** Composes a 1200x630 share card around the avatar the component rendered. */
export function buildOgSvg(source: SVGSVGElement, seed: string): string {
  const clone = source.cloneNode(true) as SVGSVGElement
  clone.removeAttribute('style')
  clone.setAttribute('width', '200')
  clone.setAttribute('height', '200')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0d12"/>
  <circle cx="1050" cy="90" r="260" fill="#8b7cff" opacity="0.12"/>
  <g transform="translate(60 65) scale(2.5)">${clone.innerHTML}</g>
  <text x="640" y="270" fill="#f2f4fa" font-family="ui-sans-serif, system-ui, sans-serif" font-size="62" font-weight="700">react-avatar-kit</text>
  <text x="642" y="330" fill="#9aa3b8" font-family="ui-monospace, monospace" font-size="26">seed: ${escapeXml(seed)}</text>
  <text x="642" y="386" fill="#ffb86b" font-family="ui-sans-serif, system-ui, sans-serif" font-size="30">One seed in. One memorable avatar out.</text>
</svg>`
}

export async function svgToPng(markup: string, width: number, height: number): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
  try {
    const image = new Image()
    image.decoding = 'sync'
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Could not rasterise the OG image'))
      image.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D is not available')
    context.drawImage(image, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('PNG encoding failed')
    return blob
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
