import { test, expect } from '@playwright/test'

test.describe('Analytics Utility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await page.evaluate(() => {
      ;(window as any).gtag = function (...args: any[]) {
        ;(window as any).gtagCalls = (window as any).gtagCalls ?? []
        ;(window as any).gtagCalls.push(args)
      }
    })
  })

  test('should track pageviews', async ({ page }) => {
    await page.evaluate(() => {
      const GA_TRACKING_ID = 'G-TEST-ID'
      const ALLOWED_DOMAINS = ['anaqio.com']
      const url = '/test-page'

      if (window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
          page_path: url,
          linker: { domains: ALLOWED_DOMAINS },
        })
      }
    })

    const calls = await page.evaluate(() => (window as any).gtagCalls)
    expect(calls[0][0]).toBe('config')
    expect(calls[0][1]).toBe('G-TEST-ID')
    expect(calls[0][2].page_path).toBe('/test-page')
  })

  test('should track events with parameters', async ({ page }) => {
    await page.evaluate(() => {
      if (window.gtag) {
        window.gtag('event', 'form_submission', {
          event_category: 'conversion',
          event_label: 'waitlist',
          form_field_email: 't***@example.com',
        })
      }
    })

    const calls = await page.evaluate(() => (window as any).gtagCalls)
    expect(calls[0]).toEqual([
      'event',
      'form_submission',
      {
        event_category: 'conversion',
        event_label: 'waitlist',
        form_field_email: 't***@example.com',
      },
    ])
  })
})
