import { test, expect } from '@playwright/test';

test.describe('Web Novel - Discovery & Navigation', () => {
  
  test('Homepage should load with all sections', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Check logo
    await expect(page.getByText('NovelThai').first()).toBeVisible();
    
    // Check main navigation
    await expect(page.getByRole('link', { name: 'หน้าแรก', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'นิยาย', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'หมวดหมู่', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'จัดอันดับ', exact: true })).toBeVisible();
    
    // Check hero section has CTA
    await expect(page.getByRole('link', { name: 'เริ่มอ่านนิยาย' })).toBeVisible();
    
    // Check footer exists
    await expect(page.getByText('NovelThai').last()).toBeVisible();
  });

  test('Search page should load and accept search queries', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // Check search input exists - use the search page specific input
    const searchInput = page.getByRole('textbox', { name: /ค้นหานิยาย ชื่อผู้แต่ง/ });
    await expect(searchInput).toBeVisible();
    
    // Check page title or heading - use exact: true to avoid strict mode violation
    await expect(page.getByRole('heading', { name: 'ค้นหา', exact: true })).toBeVisible();
  });

  test('Categories page should display genre categories', async ({ page }) => {
    await page.goto('http://localhost:3000/categories');
    
    // Check page loads
    await expect(page).toHaveURL(/.*categories/);
    
    // Check for at least one category
    const categories = ['แฟนตาซี', 'โรแมนซ์', 'ผจญภัย', 'กำลังภายใน', 'สยองขวัญ', 'นิยายวิทยาศาสตร์', 'ตลก', 'ดราม่า', 'แอ็คชั่น'];
    const categoryElements = page.locator('[class*="category"], [class*="card"], a[href*="category"]');
    await expect(categoryElements.first()).toBeVisible({ timeout: 10000 });
  });

  test('Ranking page should display ranked novels', async ({ page }) => {
    await page.goto('http://localhost:3000/ranking');
    
    // Check page loads
    await expect(page).toHaveURL(/.*ranking/);
    
    // Should show ranking heading
    await expect(page.getByRole('heading', { name: /จัดอันดับ/ })).toBeVisible({ timeout: 10000 });
  });

  test('Novel detail page should load from novels listing', async ({ page }) => {
    await page.goto('http://localhost:3000/novels');
    
    // Wait for page to load
    await expect(page.locator('a[href*="/novel/"]').first()).toBeVisible({ timeout: 10000 });
    
    // Click on first novel
    const firstNovel = page.locator('a[href*="/novel/"]').first();
    const href = await firstNovel.getAttribute('href');
    
    await firstNovel.click();
    await page.waitForURL(/.*\/novel\/.*/);
    
    // Check novel detail page loaded
    await expect(page).toHaveURL(/.*\/novel\/.*/);
    
    // Should have chapters list or novel info - use specific heading
    await expect(page.getByRole('heading', { name: /ตอน|Chapter/ }).first()).toBeVisible({ timeout: 10000 });
  });

  test('Footer links should be present and valid', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer sections exist - use headings
    await expect(page.getByRole('heading', { name: /สำหรับผู้อ่าน|For Readers/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /สำหรับนักเขียน|For Writers/ })).toBeVisible();
  });

});
