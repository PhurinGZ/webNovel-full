import { test, expect } from '@playwright/test';

const MAIN_SITE = 'http://localhost:3000';
const ADMIN_PANEL = 'http://localhost:3001';

test.describe('NovelThai System Audit', () => {
  
  test('Main Site: Navigation & Core UI', async ({ page }) => {
    await page.goto(MAIN_SITE);
    
    // Check for logo text - use first() to avoid strict mode violation (header and footer both have logo)
    await expect(page.locator('span:has-text("Novel")').first()).toBeVisible();
    await expect(page.locator('span:has-text("Thai")').first()).toBeVisible();
    
    // Check if hero buttons exist
    const readButton = page.getByRole('link', { name: 'เริ่มอ่านนิยาย' });
    await expect(readButton).toBeVisible();
  });

  test('Main Site: Catalog Page Health', async ({ page }) => {
    await page.goto(`${MAIN_SITE}/novels`);
    // Should load the catalog even if empty
    await expect(page).toHaveURL(/.*novels/);
  });

  test('Admin Panel: Login UI Health', async ({ page }) => {
    await page.goto(`${ADMIN_PANEL}/login`);
    await expect(page.locator('h1')).toContainText('Admin Portal');
    const emailInput = page.getByPlaceholder('admin@novelthai.com');
    await expect(emailInput).toBeVisible();
  });

  test('Admin Panel: Internal Routes Status', async ({ page }) => {
    const internalPaths = ['/novels', '/users', '/finance', '/categories', '/settings'];
    for (const path of internalPaths) {
      const response = await page.request.get(`${ADMIN_PANEL}${path}`);
      // Status 200 means the page exists and is served
      expect(response.status()).toBe(200);
    }
  });

});
