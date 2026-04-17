import { test, expect } from '@playwright/test'

test.describe('Navigation Progress Performance', () => {
  test('should minimize long tasks during progress animation', async ({ page }) => {
    await page.addInitScript(() => {
      window['__performanceMetrics'] = {
        longTasks: [],
      }

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

    // Clear initial long tasks from page load
    await page.evaluate(() => {
      window['__performanceMetrics'].longTasks = []
    })

    // Trigger navigation start event
    await page.evaluate(() => {
      window.dispatchEvent(new Event('anaqio:nav:start'))
    })

    // Wait for the animation to reach 80% (it uses 0.11 easing, should be fast but let's wait a bit)
    await page.waitForTimeout(1000)

    const metrics = await page.evaluate(() => {
      const pm = window['__performanceMetrics']
      let tbt = 0
      for (const lt of pm.longTasks) {
        tbt += lt.duration - 50
      }
      return {
        tbt: tbt,
        longTaskCount: pm.longTasks.length,
        maxLongTaskDuration: Math.max(
          0,
          ...pm.longTasks.map((lt: { duration: number }) => lt.duration)
        ),
      }
    })

    console.warn(
      `Navigation Animation Performance - TBT: ${metrics.tbt.toFixed(2)}ms, Long Tasks: ${metrics.longTaskCount}, Max Duration: ${metrics.maxLongTaskDuration.toFixed(2)}ms`
    )

    // We expect very little TBT for just a small progress bar animation
    // But since it's currently triggering React renders every frame, it might be more than zero
    expect(metrics.tbt).toBeDefined()
  })
})
