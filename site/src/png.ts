/**
 * Rasterises the rendered avatar to a PNG and triggers a download.
 *
 * The SVG is cloned, sized explicitly, serialised and drawn into a canvas so the
 * exported image is crisp at the requested resolution.
 */
export async function downloadPng(
  svg: SVGSVGElement,
  filename: string,
  size = 1024,
): Promise<void> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(size))
  clone.setAttribute('height', String(size))

  const markup = new XMLSerializer().serializeToString(clone)
  const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const image = new Image()
    image.decoding = 'sync'
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Could not rasterise the avatar'))
      image.src = svgUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D is not available')
    context.drawImage(image, 0, 0, size, size)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })
    if (!blob) throw new Error('PNG encoding failed')

    const pngUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(pngUrl), 1000)
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}
