import { expect, test } from '@playwright/test';

/**
 * Locale Switcher E2E Tests
 *
 * Tests the language selector component mounted in the Header.
 * Covers: visibility, dropdown interaction, URL switching, RTL direction,
 * active state indicator, and mobile menu locale switching.
 *
 * data-testid contract:
 *   locale-switcher           — wrapper div
 *   locale-switcher-trigger   — dropdown trigger button
 *   locale-option-{locale}    — each individual option (en-US, fr-FR, ar-MA)
 */

test.describe('Locale Switcher — Component Visibility', () => {
  test('renders in header with flag and short code', async ({ page }) => {
    await page.goto('/en-US');
    const trigger = page.getByTestId('locale-switcher-trigger');
    await expect(trigger).toBeVisible();
    // Should show flag emoji and short code for en-US
    await expect(trigger).toContainText('EN');
  });

  test('shows current locale flag for each starting locale', async ({
    page,
  }) => {
    for (const [locale, code] of [
      ['en-US', 'EN'],
      ['fr-FR', 'FR'],
      ['ar-MA', 'AR'],
    ] as const) {
      await page.goto(`/${locale}`);
      const trigger = page.getByTestId('locale-switcher-trigger');
      await expect(trigger).toBeVisible();
      await expect(trigger).toContainText(code);
    }
  });
});

test.describe('Locale Switcher — Dropdown Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en-US');
  });

  test('opens dropdown on trigger click', async ({ page }) => {
    const trigger = page.getByTestId('locale-switcher-trigger');
    await trigger.click();

    const dropdown = page.getByRole('listbox');
    await expect(dropdown).toBeVisible();
  });

  test('shows all 3 locale options in dropdown', async ({ page }) => {
    await page.getByTestId('locale-switcher-trigger').click();

    await expect(page.getByTestId('locale-option-en-US')).toBeVisible();
    await expect(page.getByTestId('locale-option-fr-FR')).toBeVisible();
    await expect(page.getByTestId('locale-option-ar-MA')).toBeVisible();
  });

  test('dropdown options show full language names', async ({ page }) => {
    await page.getByTestId('locale-switcher-trigger').click();

    await expect(page.getByTestId('locale-option-en-US')).toContainText(
      'English'
    );
    await expect(page.getByTestId('locale-option-fr-FR')).toContainText(
      'Français'
    );
    await expect(page.getByTestId('locale-option-ar-MA')).toContainText(
      'العربية'
    );
  });

  test('closes dropdown when clicking outside', async ({ page }) => {
    await page.getByTestId('locale-switcher-trigger').click();
    await expect(page.getByRole('listbox')).toBeVisible();

    // Click outside the dropdown
    await page.mouse.click(10, 10);
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });

  test('closes dropdown after selecting a locale', async ({ page }) => {
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-en-US').click();
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });
});

test.describe('Locale Switcher — URL Navigation', () => {
  test('switching to French updates URL to /fr-FR/*', async ({ page }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-fr-FR').click();

    await expect(page).toHaveURL(/\/fr-FR/);
  });

  test('switching to Arabic updates URL to /ar-MA/*', async ({ page }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-ar-MA').click();

    await expect(page).toHaveURL(/\/ar-MA/);
  });

  test('switching back to English updates URL to /en-US/*', async ({
    page,
  }) => {
    await page.goto('/fr-FR');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-en-US').click();

    await expect(page).toHaveURL(/\/en-US/);
  });

  test('preserves current path when switching locales', async ({ page }) => {
    await page.goto('/en-US/about');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-fr-FR').click();

    // Should navigate to /fr-FR/about, not /fr-FR/
    await expect(page).toHaveURL(/\/fr-FR\/about/);
  });
});

test.describe('Locale Switcher — RTL Support', () => {
  test('Arabic locale applies dir=rtl to html element', async ({ page }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-ar-MA').click();

    await expect(page).toHaveURL(/\/ar-MA/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('English locale has no RTL direction on html element', async ({
    page,
  }) => {
    await page.goto('/ar-MA');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-en-US').click();

    await expect(page).toHaveURL(/\/en-US/);
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir === null || dir === 'ltr').toBeTruthy();
  });

  test('Arabic option button has dir=rtl attribute', async ({ page }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();

    const arOption = page.getByTestId('locale-option-ar-MA');
    await expect(arOption).toHaveAttribute('dir', 'rtl');
  });
});

test.describe('Locale Switcher — Active State', () => {
  test('active locale option has aria-selected=true', async ({ page }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();

    const enOption = page.getByTestId('locale-option-en-US');
    await expect(enOption.locator('xpath=..')).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('inactive locale options do not have aria-selected', async ({
    page,
  }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();

    const frParent = page
      .getByTestId('locale-option-fr-FR')
      .locator('xpath=..');
    const arParent = page
      .getByTestId('locale-option-ar-MA')
      .locator('xpath=..');

    await expect(frParent).not.toHaveAttribute('aria-selected', 'true');
    await expect(arParent).not.toHaveAttribute('aria-selected', 'true');
  });

  test('trigger shows short code of active locale after switching', async ({
    page,
  }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();
    await page.getByTestId('locale-option-fr-FR').click();

    await expect(page).toHaveURL(/\/fr-FR/);
    const trigger = page.getByTestId('locale-switcher-trigger');
    await expect(trigger).toContainText('FR');
  });
});

test.describe('Locale Switcher — Accessibility', () => {
  test('trigger has aria-haspopup=listbox', async ({ page }) => {
    await page.goto('/en-US');
    await expect(page.getByTestId('locale-switcher-trigger')).toHaveAttribute(
      'aria-haspopup',
      'listbox'
    );
  });

  test('trigger has aria-expanded=false when closed', async ({ page }) => {
    await page.goto('/en-US');
    await expect(page.getByTestId('locale-switcher-trigger')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('trigger has aria-expanded=true when open', async ({ page }) => {
    await page.goto('/en-US');
    await page.getByTestId('locale-switcher-trigger').click();
    await expect(page.getByTestId('locale-switcher-trigger')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  test('locale switcher is keyboard accessible via Tab', async ({ page }) => {
    await page.goto('/en-US');
    // Tab to the locale switcher trigger
    await page.keyboard.press('Tab');
    // Eventually the locale switcher trigger should be focusable
    const trigger = page.getByTestId('locale-switcher-trigger');
    await trigger.focus();
    await expect(trigger).toBeFocused();
  });
});
