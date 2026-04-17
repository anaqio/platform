import { test, expect } from '@playwright/test'

import type { Page } from '@playwright/test'

/**
 * E2E tests for the WaitlistForm component.
 *
 * The form is now inside a shadcn Drawer, triggered by a CTA button
 * in the #final-cta section on the landing page.
 *
 * Run with: bun run test:e2e -- __tests__/waitlist/waitlist-form.e2e.test.ts
 */

const BASE = 'http://localhost:3000'
const LOCALE = 'en-US'

async function openDrawer(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById('final-cta')
    el?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1000)

  const trigger = page
    .locator('#final-cta button')
    .filter({ hasText: /invitation/i })
    .first()
  await expect(trigger).toBeVisible({ timeout: 10000 })
  await trigger.click()
  await page.waitForTimeout(600)

  // Wait for the drawer form to appear
  await expect(page.locator('form').first()).toBeVisible({ timeout: 10000 })
}

test.describe('Waitlist form — simple variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/${LOCALE}`)
    await openDrawer(page)
  })

  test('type email → submit → success message visible', async ({ page }) => {
    const emailInput = page.locator('form input[type="email"]').first()
    await emailInput.fill('e2e-simple@example.com')
    await emailInput.press('Enter')
    await expect(page.getByText("You're on the list!").first()).toBeVisible({
      timeout: 10000,
    })
  })
})

test.describe('Waitlist form — full variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/${LOCALE}`)
    await openDrawer(page)
  })

  test('complete all 3 steps → success visible', async ({ page }) => {
    // Step 1
    await page.getByPlaceholder('Your name').fill('E2E User')
    await page.getByPlaceholder('professional@email.com').fill('e2e-full@example.com')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.waitForTimeout(500)

    // Step 2
    await page.getByRole('combobox').selectOption('Brand')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.waitForTimeout(500)

    // Step 3
    await page.getByRole('button', { name: /secure beta access/i }).click()

    await expect(page.getByText("You're on the list!").first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('validation: submit step 1 empty → error messages visible', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click()

    await expect(page.getByText('Name is required').first()).toBeVisible()
    await expect(page.getByText('Email is required').first()).toBeVisible()
  })

  test('back navigation: reach step 2 → click Back → step 1 data preserved', async ({ page }) => {
    await page.getByPlaceholder('Your name').fill('Back Nav User')
    await page.getByPlaceholder('professional@email.com').fill('backnav@example.com')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.waitForTimeout(500)

    await expect(page.getByText('Profile').first()).toBeVisible()
    await page.getByRole('button', { name: /back/i }).click()
    await page.waitForTimeout(500)

    await expect(page.locator('input[value="Back Nav User"]').first()).toBeVisible()
    await expect(page.locator('input[value="backnav@example.com"]').first()).toBeVisible()
  })
})
