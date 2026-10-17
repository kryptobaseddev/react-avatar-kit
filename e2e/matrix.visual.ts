import { expect, test } from '@playwright/test'

test.describe('visual regression matrix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?matrix=1')
    await expect(page.getByTestId('visual-matrix')).toBeVisible()
  })

  test('shapes', async ({ page }) => {
    await expect(page.getByTestId('matrix-shapes').locator('.matrix__grid')).toHaveScreenshot(
      'shapes.png',
    )
  })

  test('sizes', async ({ page }) => {
    await expect(page.getByTestId('matrix-sizes').locator('.matrix__grid')).toHaveScreenshot(
      'sizes.png',
    )
  })

  test('parts', async ({ page }) => {
    await expect(page.getByTestId('matrix-parts').locator('.matrix__grid')).toHaveScreenshot(
      'parts.png',
    )
  })

  test('palettes', async ({ page }) => {
    await expect(page.getByTestId('matrix-palettes').locator('.matrix__grid')).toHaveScreenshot(
      'palettes.png',
    )
  })
})
