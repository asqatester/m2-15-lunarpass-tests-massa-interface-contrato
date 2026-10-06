import { test, expect } from '@playwright/test'

import { LoginPage } from '../pages/login.page'
import { NavBar } from '../pages/components/navbar'

import { faker } from '@faker-js/faker'

import { Mission } from '../support/mission'

test('deve cadastrar uma nova missão', async ({ page }) => {

  //conceito de contrato a partir de uma interface
  const mission: Mission = {
    id: 'LP-' + faker.string.alphanumeric({ length: { min: 5, max: 5 }, casing: 'upper' }),
    rocket: 'Starship',
    lunarBase: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '27 de jan. de 2028',
    price: '1000'
  }

  const loginPage = new LoginPage(page)
  const navbar = new NavBar(page)

  const missionId =

    await loginPage.go()
  await loginPage.login('buzz@lunarpass.dev', 'pwd123')

  //use isso apenas para debug ou teste preliminar de investigação!
  //para aguardar carregamento de elemnto é a pior estratégia de automação
  //await page.waitForTimeout(10000)

  //então aumente o timeout direto no toBeVisible que terá até tantos segundos
  await expect(navbar.logout).toBeVisible({ timeout: 10_000 })

  await page.getByRole('button', { name: 'Nova missão' }).click()
  await expect(page.getByRole('heading', { name: 'Programar missão' })).toBeVisible()

  await page.getByRole('textbox', { name: 'ID da missão' }).fill(mission.id)
  await page.getByRole('textbox', { name: 'Foguete' }).fill(mission.rocket)
  await page.getByLabel('Base lunar').selectOption(mission.lunarBase)
  await page.getByRole('textbox', { name: 'Data de partida' }).fill(mission.departureDate)
  await expect(page.getByTestId('mission-form-return-date')).toContainText(mission.returnDate)
  await page.getByRole('spinbutton', { name: 'Preço por passagem (USD)' }).fill(mission.price)

  await page.getByRole('button', { name: 'Salvar missão' }).click()
  await expect(page.getByRole('listitem')).toContainText('Missão criada.')
})