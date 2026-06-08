// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuration Playwright pour le portfolio.
 * L'URL cible se règle via la variable d'env BASE_URL.
 * Par défaut on teste la prod en ligne.
 */
const BASE_URL = process.env.BASE_URL || 'https://kevinauchoybur.me';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,       // échoue si un test.only traîne en CI
  retries: process.env.CI ? 2 : 0,    // 2 retries en CI pour absorber le flakiness réseau
  workers: process.env.CI ? 2 : undefined,

  // Rapports : HTML (joli, pour Jenkins) + JUnit (pour le widget "Test Results" de Jenkins)
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',          // trace rejouable en cas d'échec
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});
