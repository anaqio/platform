import { test, expect } from '@playwright/test'

test.describe('Brand Token Preservation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1500) // let Framer Motion settle
  })

  test('display headings use Syne font', async ({ page }) => {
    // The <h1> (sr-only) and all visible font-display elements should resolve to Syne
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    const fontFamily = await h1.evaluate((el) => window.getComputedStyle(el).fontFamily)
    expect(fontFamily.toLowerCase()).toContain('syne')
  })

  test('body text uses Plus Jakarta Sans', async ({ page }) => {
    const body = page.locator('body')
    const fontFamily = await body.evaluate((el) => window.getComputedStyle(el).fontFamily)
    expect(fontFamily.toLowerCase()).toContain('jakarta')
  })

  test('primary CTA button has --gold background (#D4AF37)', async ({ page }) => {
    // Scroll to the final-cta section and open the Drawer
    await page.evaluate(() => {
      const el = document.getElementById('final-cta')
      el?.scrollIntoView({ behavior: 'instant' })
    })
    await page.waitForTimeout(1000)

    const trigger = page
      .locator('#final-cta button')
      .filter({ hasText: /invitation/i })
      .first()
    if ((await trigger.count()) === 0) {
      test.skip()
      return
    }
    await trigger.click()
    await page.waitForTimeout(600)

    // The "brand" variant button is the primary gold CTA inside the form
    const ctaButton = page.locator('button[type="submit"]').first()
    if ((await ctaButton.count()) === 0) {
      test.skip()
      return
    }

    await expect(ctaButton).toBeVisible({ timeout: 8000 })

    const bg = await ctaButton.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    // #D4AF37 → rgb(212, 175, 55)
    expect(bg).toBe('rgb(212, 175, 55)')
  })

  test('body background is dark', async ({ page }) => {
    const bodyBg = await page.locator('body').evaluate((el) => {
      const bg = window.getComputedStyle(el).backgroundColor
      const m = bg.match(/\d+/g)
      if (!m) return { r: 255, g: 255, b: 255 }
      return { r: Number(m[0]), g: Number(m[1]), b: Number(m[2]) }
    })

    // Relative luminance — must be < 0.15 (dark background requirement)
    const luminance =
      0.2126 * (bodyBg.r / 255) + 0.7152 * (bodyBg.g / 255) + 0.0722 * (bodyBg.b / 255)

    expect(luminance).toBeLessThan(0.15)
  })

  test('electric blue token is applied', async ({ page }) => {
    // Scroll to the hero which is vb-blue
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    const electricBlue = await page.evaluate(() => {
      const el = document.querySelector('.vb-blue')
      if (!el) return null
      return window.getComputedStyle(el).backgroundColor
    })

    // #2B3AE7 → rgb(43, 58, 231)
    expect(electricBlue).toBe('rgb(43, 58, 231)')
  })

  test('gold underline accent is defined', async ({ page }) => {
    const underlineColor = await page.evaluate(() => {
      const el = document.querySelector('.vb-underline')
      if (!el) return null
      return window.getComputedStyle(el).textDecorationColor
    })

    // #D4AF37 → rgb(212, 175, 55)
    expect(underlineColor).toBe('rgb(212, 175, 55)')
  })
})
