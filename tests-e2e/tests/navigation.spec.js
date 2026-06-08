const { test, expect } = require('@playwright/test');

test.describe('Navigation & ancres', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('la page se charge avec le bon titre', async ({ page }) => {
    await expect(page).toHaveTitle(/Kevin Auchoybur/i);
  });

  test('le logo/nom de marque ramène à la section accueil', async ({ page }) => {
    await page.locator('.navbar__brand').click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#home')).toBeInViewport();
  });

  const liens = [
    { sel: 'a[href="#expertises"]', cible: '#expertises' },
    { sel: 'a[href="#projects"]',   cible: '#projects' },
    { sel: 'a[href="#cv"]',         cible: '#cv' },
    { sel: 'a[href="#contact"]',    cible: '#contact' },
  ];

  for (const { sel, cible } of liens) {
    test(`le lien de menu vers ${cible} scrolle vers la bonne section`, async ({ page }) => {
      // On cible le lien dans la navbar desktop
      await page.locator(`.navbar__links ${sel}`).click();
      await expect(page).toHaveURL(new RegExp(`${cible}$`));
      await expect(page.locator(cible)).toBeInViewport();
    });
  }
});
