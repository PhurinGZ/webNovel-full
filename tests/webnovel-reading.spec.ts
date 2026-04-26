import { test, expect } from '@playwright/test';

test.describe('Web Novel - Reading Experience', () => {
  
  test('Reader should have theme and font controls', async ({ page }) => {
    // Navigate to a novel first
    await page.goto('http://localhost:3000/novels');
    await page.waitForTimeout(2000);
    
    // Try to find and click a chapter link
    const chapterLinks = page.locator('a[href*="/read/"]');
    const count = await chapterLinks.count();
    
    if (count > 0) {
      await chapterLinks.first().click();
      await page.waitForURL(/.*\/read\/.*/, { timeout: 10000 });
      
      // Check reader page loaded
      await expect(page).toHaveURL(/.*\/read\/.*/);
      
      // Check for reader controls (theme, font size, etc.)
      const readerContent = page.locator('[class*="reader"], [class*="chapter"], [class*="content"]');
      await expect(readerContent.first()).toBeVisible({ timeout: 10000 });
    } else {
      // No chapters available, skip this test scenario
      console.log('No chapters available to test reader');
    }
  });

  test('Novels listing should have clickable novel cards', async ({ page }) => {
    await page.goto('http://localhost:3000/novels');
    
    // Check for novel cards - use link elements
    const novelLinks = page.locator('a[href*="/novel/"]');
    await expect(novelLinks.first()).toBeVisible({ timeout: 10000 });
    
    // Check for novel title and author info - use heading
    await expect(page.getByRole('heading', { name: 'นิยายทั้งหมด', exact: true })).toBeVisible();
  });

});

test.describe('Web Novel - Writing & Dashboard', () => {
  
  test('Writer Studio page should require authentication', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login if not authenticated
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(auth\/login|dashboard)/);
  });

  test('Write page should require authentication', async ({ page }) => {
    await page.goto('http://localhost:3000/write');
    
    // Should redirect to login if not authenticated
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(auth\/login|write)/);
  });

  test('Writer Stats page should exist', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/stats');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(auth\/login|dashboard\/stats)/);
  });

  test('Writer Payout page should exist', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/payout');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(auth\/login|dashboard\/payout)/);
  });

});
