const { test, expect } = require('@playwright/test');

test.describe('Switch de thème', () => {
  test('le toggle bascule entre clair et sombre', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    // Le mode clair = attribut data-theme absent (null) ; le mode sombre = "dark".
    const lireTheme = () => html.getAttribute('data-theme');

    // État de départ (selon localStorage / préférence système). On lit, puis on bascule.
    const avant = await lireTheme();
    await page.locator('#themeToggle').click();
    const apres = await lireTheme();
    expect(apres).not.toBe(avant);
    // L'un des deux états est forcément "dark", l'autre null (clair)
    expect([avant, apres].sort().join(',')).toContain('dark');

    // Re-clic : on revient à l'état initial
    await page.locator('#themeToggle').click();
    expect(await lireTheme()).toBe(avant);
  });
});

test.describe('Switch de langue FR / EN', () => {
  test('basculer en EN change le contenu, FR le restaure', async ({ page }) => {
    await page.goto('/');

    // En FR, le menu contient "Mes expertises"
    const lienExpertises = page.locator('.navbar__links a[href="#expertises"]');
    await expect(lienExpertises).toHaveText(/Mes expertises/i);

    // Passage EN
    await page.locator('.lang-switch button[data-lang="en"]').click();
    await expect(lienExpertises).not.toHaveText(/Mes expertises/i);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Retour FR
    await page.locator('.lang-switch button[data-lang="fr"]').click();
    await expect(lienExpertises).toHaveText(/Mes expertises/i);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });
});
