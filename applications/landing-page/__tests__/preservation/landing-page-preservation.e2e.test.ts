import { test, expect } from '@playwright/test';

test.describe('Landing Page Preservation', () => {
  test('Visual and Functional Elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // let animations settle

    // 1. Visual elements: hero and header
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    await expect(page.locator('header')).toBeVisible();

    // 2. Sidebar visible on desktop
    const sidebar = page.locator('text=MENU').first();
    await expect(sidebar).toBeVisible();

    // 3. Oversized ANAQIO wordmark visible
    const wordmark = page.locator('text=ANAQIO').first();
    await expect(wordmark).toBeVisible();

    // 4. Functional elements: Atelier Form behind Drawer trigger at #final-cta
    await page.evaluate(() => {
      const el = document.getElementById('final-cta');
      el?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);

    // Open the Drawer
    const drawerTrigger = page
      .locator('#final-cta button')
      .filter({ hasText: /invitation/i })
      .first();
    await expect(drawerTrigger).toBeVisible({ timeout: 10000 });
    await drawerTrigger.click();
    await page.waitForTimeout(600);

    // Form should now be visible inside the Drawer
    const waitlistForm = page.locator('form').first();
    await expect(waitlistForm).toBeVisible({ timeout: 10000 });

    const emailInput = waitlistForm.locator('input[type="email"]');
    if ((await emailInput.count()) > 0) {
      await expect(emailInput).toBeVisible();
    }

    const submitBtn = waitlistForm.locator('button[type="submit"]');
    if ((await submitBtn.count()) > 0) {
      await expect(submitBtn).toBeVisible();
    }

    // 5. Accessibility & semantics requirements
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // 6. Team section visible
    await page.evaluate(() => {
      const el = document.getElementById('team');
      el?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);
    await expect(page.locator('text=Amal AIT OUKHARAZ')).toBeVisible();
    await expect(page.locator('text=Mohamed MOUGHAMIR')).toBeVisible();

    // 7. Blue/white alternating sections exist
    await expect(page.locator('.vb-blue').first()).toBeVisible();
    await expect(page.locator('.vb-white').first()).toBeVisible();

    // 8. Scroll to check transitions don't cause crashes
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });
});
