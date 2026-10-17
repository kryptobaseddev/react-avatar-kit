import { expect, test } from '@playwright/test'

const preview = '[data-testid="avatar-preview"] > svg'

test.describe('playground', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(String(error)))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One seed in')
    await expect(page.locator(preview)).toBeVisible()
    expect(errors).toEqual([])
  })

  test('the seed input changes the rendered avatar', async ({ page }) => {
    await page.goto('/')
    const before = await page.locator(preview).innerHTML()

    await page.getByTestId('seed-input').fill('a-brand-new-seed')
    await expect(page.getByTestId('seed-input')).toHaveValue('a-brand-new-seed')

    const after = await page.locator(preview).innerHTML()
    expect(after).not.toBe(before)
  })

  test('the editor changes the rendered avatar', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('seed-input').fill('editor-test')
    const before = await page.locator(preview).innerHTML()

    await page.getByTestId('hair-mohawk').click()
    await expect(page.getByTestId('hair-mohawk')).toHaveAttribute('aria-pressed', 'true')
    let after = await page.locator(preview).innerHTML()
    expect(after).not.toBe(before)

    await page.getByTestId('glasses-round').click()
    after = await page.locator(preview).innerHTML()
    expect(after).toContain('circle')

    await page.getByTestId('palette-vivid').click()
    await expect(page.getByTestId('palette-vivid')).toHaveAttribute('aria-pressed', 'true')
  })

  test('shape none removes the background canvas', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('shape-none').click()
    await expect(page.getByTestId('shape-none')).toHaveAttribute('aria-pressed', 'true')
    const markup = await page.locator(preview).innerHTML()
    expect(markup).not.toContain('width="200" height="200" fill="#')
  })

  test('exports a PNG', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('seed-input').fill('png-export')

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('download-png').click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe('avatar-png-export.png')
    const path = await download.path()
    expect(path).not.toBeNull()
    const { readFileSync } = await import('node:fs')
    const bytes = readFileSync(path as string)
    expect(bytes.length).toBeGreaterThan(2000)
    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  })

  test('editor controls are exposed as labelled groups', async ({ page }) => {
    await page.goto('/')
    for (const name of [
      'Shape',
      'Palette',
      'Hair',
      'Hat',
      'Eyes',
      'Brows',
      'Glasses',
      'Nose',
      'Mouth',
      'Ears',
      'Shirt',
      'Facial hair',
      'Earrings',
      'Headphones',
      'Background',
    ]) {
      await expect(page.getByRole('group', { name, exact: true })).toBeVisible()
    }
  })

  test('the editor exposes every 1.1 part and palette', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('seed-input').fill('one-one-parts')
    const before = await page.locator(preview).innerHTML()

    await page.getByTestId('facial-hair-beard').click()
    await expect(page.getByTestId('facial-hair-beard')).toHaveAttribute('aria-pressed', 'true')
    let after = await page.locator(preview).innerHTML()
    expect(after).not.toBe(before)

    await page.getByTestId('earring-hoop').click()
    await expect(page.getByTestId('earring-hoop')).toHaveAttribute('aria-pressed', 'true')

    await page.getByTestId('headphones-over-ear').click()
    await expect(page.getByTestId('headphones-over-ear')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('headphone-color')).toBeVisible()

    await page.getByTestId('hair-buzz').click()
    await expect(page.getByTestId('hair-buzz')).toHaveAttribute('aria-pressed', 'true')

    await page.getByTestId('palette-earth').click()
    await expect(page.getByTestId('palette-earth')).toHaveAttribute('aria-pressed', 'true')
    await page.getByTestId('palette-neon').click()
    await expect(page.getByTestId('palette-neon')).toHaveAttribute('aria-pressed', 'true')

    after = await page.locator(preview).innerHTML()
    expect(after).not.toBe(before)
  })

  test('a gallery seed loads into the studio', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use seed margaret' }).click()
    await expect(page.getByTestId('seed-input')).toHaveValue('margaret')
  })
})
