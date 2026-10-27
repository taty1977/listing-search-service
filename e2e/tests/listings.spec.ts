import { expect, test } from '@playwright/test';

test('paginates, searches, filters, and opens a listing without runtime errors', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: '12 properties found' })).toBeVisible();
  await expect(page.getByTestId('listing-card')).toHaveCount(9);
  const firstPageAddresses = await page.getByTestId('listing-card').getByRole('heading').allTextContents();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Page 2 of 2')).toBeVisible();
  await expect(page.getByTestId('listing-card')).toHaveCount(3);
  const secondPageAddresses = await page.getByTestId('listing-card').getByRole('heading').allTextContents();
  expect(secondPageAddresses.every((address) => !firstPageAddresses.includes(address))).toBe(true);

  await page.getByRole('textbox', { name: 'Location', exact: true }).fill('Austin, TX');
  await page.getByRole('search').getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('heading', { name: '4 properties found' })).toBeVisible();
  await expect(page.getByTestId('listing-card')).toHaveCount(4);
  await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(0);

  if (isMobile) {
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
  }
  await page.getByRole('form', { name: 'Filter listings' }).getByText('Active', { exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Active', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
  await expect(page.getByRole('heading', { name: '2 properties found' })).toBeVisible();
  await expect(page.getByTestId('listing-card')).toHaveCount(2);

  await page.getByRole('link', { name: '88 Rainey St Unit 1204', exact: true }).click();
  await expect(page).toHaveURL(/\/listings\/MLS_A\/1002$/);
  await expect(page.getByRole('heading', { level: 1, name: '88 Rainey St Unit 1204' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Property facts' })).toBeVisible();
  await expect(page.getByRole('article').getByText('$529,000', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Back to search', exact: true }).click();
  await expect(page.getByRole('heading', { name: '2 properties found' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('opens a listing directly and keeps shared UI responsive to theme variables', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/listings/MLS_A/1002');
  await expect(page.getByRole('heading', { level: 1, name: '88 Rainey St Unit 1204' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to search', exact: true }).click();
  await expect(page.getByRole('heading', { name: '12 properties found' })).toBeVisible();

  const search = page.getByRole('search');
  await expect(search).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--background-surface', 'rgb(20, 30, 40)');
    document.documentElement.style.setProperty('--text-primary', 'rgb(220, 230, 240)');
    document.documentElement.style.setProperty('--shadow-card-hover', 'rgb(1, 2, 3) 0px 2px 6px 0px');
  });
  await expect(search).toHaveCSS('background-color', 'rgb(20, 30, 40)');
  await expect(search).toHaveCSS('box-shadow', /(?:^|, )rgb\(1, 2, 3\) 0px 2px 6px 0px$/);
  await expect(page.getByRole('heading', { name: '12 properties found' })).toHaveCSS('color', 'rgb(220, 230, 240)');

  await page.evaluate(() => {
    for (const name of ['--background-surface', '--text-primary', '--shadow-card-hover']) {
      document.documentElement.style.removeProperty(name);
    }
  });
  await expect(search).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  expect(errors).toEqual([]);
});
