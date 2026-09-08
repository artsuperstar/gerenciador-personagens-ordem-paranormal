import { expect, test } from '@playwright/test'
import { INDEX_STORAGE_KEY } from '../src/storage'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('edita e persiste as informações básicas do agente', async ({ page }) => {
  await page.getByRole('button', { name: 'Editar informações básicas' }).click()
  await page.getByLabel('Nome do personagem').fill('Lia Torres')
  await page.getByLabel('Classe').fill('Especialista')
  await page.getByLabel('NEX (%)').fill('15')
  await page.getByRole('button', { name: 'Salvar' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lia Torres')
  await expect(page.getByRole('navigation', { name: 'Agentes' })).toContainText('NEX 15% · Especialista')
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), INDEX_STORAGE_KEY)).not.toBeNull()

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lia Torres')
})

test('cria, alterna e exclui agentes com confirmação', async ({ page }) => {
  await page.getByRole('button', { name: '+ Novo agente', exact: true }).click()
  await expect(page.locator('.character-option')).toHaveCount(2)

  await page.getByRole('button', { name: 'Excluir selecionado' }).click()
  const confirmation = page.getByRole('group', { name: 'Confirmar exclusão do agente' })
  await expect(confirmation).toBeVisible()
  await confirmation.getByRole('button', { name: 'Excluir agente' }).click()
  await expect(page.locator('.character-option')).toHaveCount(1)
})

test('abre e fecha a sidebar pelo menu hamburger no celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const sidebar = page.locator('#character-sidebar')
  const menuButton = page.getByRole('button', { name: 'Abrir menu de agentes' })

  await expect(menuButton).toBeVisible()
  await expect(sidebar).not.toBeInViewport()
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(sidebar).toBeInViewport()

  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(sidebar).not.toBeInViewport()

  await menuButton.click()
  await sidebar.getByRole('button', { name: 'Fechar menu de agentes' }).click()
  await expect(sidebar).not.toBeInViewport()
})

test('edita e persiste atributos e bônus de perícias', async ({ page }) => {
  const panel = page.getByRole('region', { name: 'Atributos e perícias' })
  await panel.getByRole('button', { name: 'Editar atributos e perícias' }).click()
  await panel.getByLabel(/Agilidade AGI/).fill('3')
  await panel.getByLabel('Treino de Acrobacia').fill('5')
  await panel.getByLabel('Outros bônus de Acrobacia').fill('2')
  await panel.getByRole('button', { name: 'Salvar' }).click()

  await expect(panel.locator('.attribute-score').filter({ hasText: 'Agilidade' }).locator('strong')).toHaveText('3')
  await expect(panel.getByLabel('Bônus de Acrobacia')).toHaveText('+7')
  await page.reload()
  await expect(page.getByLabel('Bônus de Acrobacia')).toHaveText('+7')
})

for (const viewport of [{ width: 320, height: 700 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  test(`não cria rolagem horizontal em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })
}
