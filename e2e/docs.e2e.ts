import { expect, test } from '@playwright/test'

test.describe('docs site', () => {
  test('search answers a part query', async ({ page }) => {
    await page.goto('docs/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('docs')

    await page.getByTestId('docs-search').fill('beard')
    const results = page.getByTestId('docs-results')
    await expect(results).toBeVisible()
    await expect(results).toContainText('beard')

    await page.getByTestId('docs-search').fill('neon')
    await expect(results).toContainText('neon')

    await page.getByTestId('docs-search').fill('createAvatar')
    await expect(results).toContainText('createAvatar')
  })

  test('examples switch', async ({ page }) => {
    await page.goto('docs/')
    await page.getByTestId('example-tab-next').click()
    await expect(page.getByTestId('example-code')).toContainText('Server Component')

    await page.getByTestId('example-tab-router').click()
    await expect(page.getByTestId('example-code')).toContainText('loader')

    await page.getByTestId('example-tab-remix').click()
    await expect(page.getByTestId('example-code')).toContainText('Remix')
  })

  test('exports an OG image', async ({ page }) => {
    await page.goto('docs/')
    await expect(page.getByTestId('og-avatar')).toBeVisible()

    const svgDownload = page.waitForEvent('download')
    await page.getByTestId('og-download-svg').click()
    const svg = await svgDownload
    expect(svg.suggestedFilename()).toBe('avatar-og.svg')
    const svgPath = await svg.path()
    expect(svgPath).not.toBeNull()
    const { readFileSync } = await import('node:fs')
    const svgText = readFileSync(svgPath as string, 'utf8')
    expect(svgText).toContain('width="1200"')
    expect(svgText).toContain('height="630"')

    const pngDownload = page.waitForEvent('download')
    await page.getByTestId('og-download-png').click()
    const png = await pngDownload
    expect(png.suggestedFilename()).toBe('avatar-og.png')
    const pngPath = await png.path()
    const bytes = readFileSync(pngPath as string)
    expect(bytes.length).toBeGreaterThan(2000)
    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  })
})
