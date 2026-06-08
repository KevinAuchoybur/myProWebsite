const { test, expect } = require('@playwright/test');

test.describe('Boutons & liens externes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('le bouton LinkedIn pointe vers le bon profil et s\'ouvre dans un nouvel onglet', async ({ page }) => {
    const linkedin = page.locator('a[href*="linkedin.com"]').first();
    await expect(linkedin).toHaveAttribute('href', /linkedin\.com\/in\/kevin-auchoybur/i);
    await expect(linkedin).toHaveAttribute('target', '_blank');
  });

  test('le bouton de téléchargement du CV pointe vers un PDF existant', async ({ page }) => {
    const cvLink = page.locator('a[href$=".pdf"]').first();
    await expect(cvLink).toHaveCount(1);
    const href = await cvLink.getAttribute('href');

    // On vérifie via une requête HEAD que le PDF est bien servi (200)
    const url = new URL(href, page.url()).toString();
    const res = await page.request.get(url);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });

  test('le bouton "Me contacter" mène à la section contact', async ({ page }) => {
    // Lien CTA du héro (premier lien vers #contact hors navbar)
    await page.locator('.hero a[href="#contact"], a.btn[href="#contact"]').first().click();
    await expect(page.locator('#contact')).toBeInViewport();
  });
});

test.describe('Menu hamburger (mobile)', () => {
  // Ne s'exécute que sur le projet mobile
  test.skip(({ isMobile }) => !isMobile, 'Réservé au viewport mobile');

  test('le hamburger ouvre puis ferme le menu', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#hamburger');
    await expect(burger).toBeVisible();

    await burger.click();
    await expect(burger).toHaveClass(/is-open/);

    await burger.click();
    await expect(burger).not.toHaveClass(/is-open/);
  });
});
