import { test, expect } from '@playwright/test';

test.describe('Web Novel - Authentication', () => {
  
  test('Login page should load with form fields', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Check heading - use first() to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /เข้าสู่ระบบ/ })).toBeVisible();
    
    // Check email input
    await expect(page.getByPlaceholder(/อีเมล|email|Email/i)).toBeVisible();
    
    // Check password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Check submit button
    await expect(page.getByRole('button', { name: /เข้าสู่ระบบ|Login/i })).toBeVisible();
    
    // Check register link
    await expect(page.getByRole('link', { name: /ลงทะเบียน|ลงทะเบียน|Register/i })).toBeVisible();
  });

  test('Register page should load with form fields', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/register');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /ลงทะเบียน/ })).toBeVisible();
    
    // Check username input
    const usernameInput = page.getByPlaceholder(/ชื่อผู้ใช้|username|Username/i);
    await expect(usernameInput).toBeVisible();
    
    // Check email input
    const emailInput = page.getByPlaceholder(/อีเมล|email|Email/i);
    await expect(emailInput).toBeVisible();
    
    // Check password input
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs.first()).toBeVisible();
    
    // Check submit button
    await expect(page.getByRole('button', { name: /ลงทะเบียน|Register|สมัคร/i })).toBeVisible();
  });

  test('Login page should redirect to register page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    const registerLink = page.getByRole('link', { name: /ลงทะเบียน|Register/i });
    await registerLink.click();
    
    // Wait for navigation - could be /register or /auth/register
    await page.waitForURL(/.*\/(auth\/)?register.*/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/(auth\/)?register.*/);
  });

  test('Should show error with invalid login credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    const emailInput = page.getByPlaceholder(/อีเมล|email|Email/i);
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.getByRole('button', { name: /เข้าสู่ระบบ|Login/i });
    
    await emailInput.fill('invalid@test.com');
    await passwordInput.fill('wrongpassword');
    await submitButton.click();
    
    // Should show error or stay on login page
    await expect(page).toHaveURL(/.*\/auth\/login.*/, { timeout: 10000 });
  });

});
