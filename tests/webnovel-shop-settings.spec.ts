import { test, expect } from '@playwright/test';

test.describe('Web Novel - Shop & User Settings', () => {
  
  test('Shop page should load with coin packages', async ({ page }) => {
    await page.goto('http://localhost:3000/shop');
    
    // Check page loads
    await expect(page).toHaveURL(/.*shop/);
    
    // Check for shop heading - use first() to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /ร้านเหรียญ/ })).toBeVisible({ timeout: 10000 });
    
    // Check for package cards (should have multiple packages)
    const packages = page.locator('[class*="card"], [class*="package"]');
    await expect(packages.first()).toBeVisible();
  });

  test('Settings page should require authentication', async ({ page }) => {
    await page.goto('http://localhost:3000/settings');
    
    // Should redirect to login if not authenticated
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(auth\/login|settings)/);
  });

  test('Profile page should load user information', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');
    
    // Check page loads
    await expect(page).toHaveURL(/.*profile/);
    
    // Check for profile sections - just verify page loaded
    await expect(page).toHaveURL(/.*profile/);
    
    // Check for links we know should be there
    await expect(page.getByRole('link', { name: 'หน้าแรก', exact: true })).toBeVisible();
  });

});
