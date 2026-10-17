import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

test.describe('accessibility', () => {
  test('the playground has no WCAG A/AA violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByTestId('avatar-preview')).toBeVisible()

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })

  test('the visual matrix has no WCAG A/AA violations', async ({ page }) => {
    await page.goto('/?matrix=1')
    await expect(page.getByTestId('visual-matrix')).toBeVisible()

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })
})
