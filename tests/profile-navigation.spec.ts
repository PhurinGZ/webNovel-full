import { test, expect } from '@playwright/test';

test('Profile page should have correct navigation links', async ({ page }) => {
  // Navigate to profile page
  await page.goto('http://localhost:3000/profile');
  
  // Check that profile page loads with URL containing 'profile'
  await expect(page).toHaveURL(/.*profile/);
  
  // Check that main navigation links exist
  const homeLink = await page.getByRole('link', { name: 'หน้าแรก' });
  await expect(homeLink).toHaveAttribute('href', '/');
  
  const novelsLink = await page.getByRole('link', { name: 'นิยาย', exact: true });
  await expect(novelsLink).toHaveAttribute('href', '/novels');
});

test('Writer Dashboard navigation from Header', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  const studioLink = await page.getByTitle('สตูดิโอจัดการนิยาย');
  await expect(studioLink).toHaveAttribute('href', '/dashboard');
});
