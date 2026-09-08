import { expect, test } from '@playwright/test'

for (const viewport of [
  { name: 'celular', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`layout ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
    })
  })
}

test('menu mobile aberto', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu de agentes' }).click()
  await expect(page.locator('#character-sidebar')).toBeInViewport()
  await expect(page).toHaveScreenshot('menu-mobile-aberto.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})
