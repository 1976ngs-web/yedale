// Yedale automated checks. Run: cd tests && npm test
const { defineConfig } = require('@playwright/test');
const PORT = 4173;
module.exports = defineConfig({
  testDir: './specs',
  timeout: 12 * 60 * 1000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never', outputFolder: 'report' }]] : [['list'], ['html', { open: 'never', outputFolder: 'report' }]],
  outputDir: 'results',
  use: {
    baseURL: 'http://localhost:' + PORT,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] }
  },
  projects: [
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
    { name: 'phone-land', use: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
    { name: 'desktop', use: { viewport: { width: 1366, height: 768 } } }
  ],
  webServer: { command: 'node support/server.js', port: PORT, reuseExistingServer: !process.env.CI, env: { PORT: String(PORT) } }
});
