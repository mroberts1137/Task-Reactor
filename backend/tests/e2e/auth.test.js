const puppeteer = require('puppeteer');

describe('Authentication Flow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`${process.env.STAGING_URL}/login`);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('User can log in successfully', async () => {
    await page.type('#email', 'testuser@example.com');
    await page.type('#password', 'password123');
    await page.click('#login-button');

    await page.waitForNavigation();
    expect(page.url()).toBe(`${process.env.STAGING_URL}/dashboard`);
  });

  // ... more tests
});
