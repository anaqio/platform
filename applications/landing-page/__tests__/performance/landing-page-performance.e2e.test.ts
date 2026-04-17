import { test, expect } from '@playwright/test'

test.describe('Landing Page Performance', () => {
  test('should satisfy TBT < 200ms, FCP < 1.8s, LCP < 2.5s', async ({ page }) => {
    // Add an init script to capture performance metrics properly
    await page.addInitScript(() => {
      window['__performanceMetrics'] = {
        fcp: 0,
        lcp: 0,
        tbt: 0,
        longTasks: [],
      }

      // FCP
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
          window['__performanceMetrics'].fcp = entry.startTime
        }
      }).observe({ type: 'paint', buffered: true })

      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        if (entries.length > 0) {
          window['__performanceMetrics'].lcp = entries[entries.length - 1].startTime
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      // Long Tasks -> TBT
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window['__performanceMetrics'].longTasks.push({
            startTime: entry.startTime,
            duration: entry.duration,
          })
        }
      }).observe({ type: 'longtask', buffered: true })
    })

    await page.goto('/', { waitUntil: 'load' })

    // Wait for at least 5 seconds for page load / animations to settle
    await page.waitForTimeout(5000)

    const metrics = await page.evaluate(() => {
      const pm = window['__performanceMetrics']
      // Calculate TBT (sum of portion of long tasks exceeding 50ms, strictly after FCP)
      let tbt = 0
      for (const lt of pm.longTasks) {
        if (pm.fcp > 0 && lt.startTime > pm.fcp) {
          tbt += lt.duration - 50
        }
      }
      return {
        fcp: pm.fcp,
        lcp: pm.lcp,
        tbt: tbt,
      }
    })

    // eslint-disable-next-line no-console
    console.log(
      `Measured Performance - FCP: ${metrics.fcp.toFixed(2)}ms, LCP: ${metrics.lcp.toFixed(2)}ms, TBT: ${metrics.tbt.toFixed(2)}ms`
    )

    expect(metrics.fcp, `FCP is ${metrics.fcp.toFixed(2)}ms (limit 1800ms)`).toBeLessThan(1800)
    expect(metrics.lcp, `LCP is ${metrics.lcp.toFixed(2)}ms (limit 2500ms)`).toBeLessThan(2500)
    expect(metrics.tbt, `TBT is ${metrics.tbt.toFixed(2)}ms (limit 200ms)`).toBeLessThan(200)
  })
})
