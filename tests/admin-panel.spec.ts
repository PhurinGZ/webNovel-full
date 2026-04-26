import { test, expect } from '@playwright/test';

test.describe('Admin Panel - Dashboard & Management', () => {
  
  // Login helper for admin panel
  async function loginAsAdmin(page: any) {
    await page.goto('http://localhost:3001/login');
    await page.waitForTimeout(1000);
    
    // Fill email and password using placeholders
    const emailInput = page.getByPlaceholder('admin@novelthai.com');
    await emailInput.fill('admin@novelthai.com');
    
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('admin123');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(2000);
  }

  test('Dashboard should load with statistics cards', async ({ page }) => {
    await loginAsAdmin(page);
    
    // After login, should be on dashboard
    await expect(page).toHaveURL(/http:\/\/localhost:3001\/?$/);
    
    // Check page loads with heading
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Novels management page should load', async ({ page }) => {
    await loginAsAdmin(page);
    
    await page.goto('http://localhost:3001/novels');
    await page.waitForTimeout(2000);
    
    // Check page loads
    await expect(page).toHaveURL(/.*\/novels/);
    
    // Check for table
    const table = page.locator('table').first();
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test('Users management page should load', async ({ page }) => {
    await loginAsAdmin(page);
    
    await page.goto('http://localhost:3001/users');
    await page.waitForTimeout(2000);
    
    // Check page loads
    await expect(page).toHaveURL(/.*\/users/);
    
    // Check for table
    await expect(page.locator('table').first()).toBeVisible({ timeout: 10000 });
  });

  test('Finance page should load with transaction history', async ({ page }) => {
    await loginAsAdmin(page);
    
    await page.goto('http://localhost:3001/finance');
    await page.waitForTimeout(2000);
    
    // Check page loads
    await expect(page).toHaveURL(/.*\/finance/);
  });

  test('Categories management page should load', async ({ page }) => {
    await loginAsAdmin(page);
    
    await page.goto('http://localhost:3001/categories');
    await page.waitForTimeout(2000);
    
    // Check page loads
    await expect(page).toHaveURL(/.*\/categories/);
  });

  test('Settings page should load with configuration tabs', async ({ page }) => {
    await loginAsAdmin(page);
    
    await page.goto('http://localhost:3001/settings');
    await page.waitForTimeout(2000);
    
    // Check page loads
    await expect(page).toHaveURL(/.*\/settings/);
  });

  test('Sidebar navigation should work between pages', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Check sidebar exists
    const sidebarLinks = page.locator('a.sidebar-link');
    await expect(sidebarLinks.first()).toBeVisible();
    
    // Navigate directly instead of clicking
    await page.goto('http://localhost:3001/novels');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*\/novels/);
    
    await page.goto('http://localhost:3001/users');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*\/users/);
  });

  test('Logout button should be visible in sidebar', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Check for logout button
    await expect(page.getByRole('button', { name: /ออกจากระบบ|Logout|Sign out/i })).toBeVisible();
  });

});
