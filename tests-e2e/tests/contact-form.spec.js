const { test, expect } = require('@playwright/test');

/**
 * Test du formulaire de contact.
 *
 * ⚠️ On NE soumet PAS réellement à Formspree : on intercepte la requête
 * réseau vers l'endpoint et on renvoie une réponse simulée 200 OK.
 * → Aucun e-mail réel envoyé, aucun quota consommé, mais tout le parcours
 *   UI est testé jusqu'au message de confirmation.
 */

const FORMSPREE = '**/formspree.io/f/**';

test.describe('Formulaire de contact (mock réseau)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
  });

  test('soumission valide → message de confirmation affiché', async ({ page }) => {
    // Intercepte l'appel Formspree et simule un succès
    await page.route(FORMSPREE, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.fill('#nom', 'Test Automatisé');
    await page.fill('#email', 'qa@example.com');
    await page.fill('#message', 'Ceci est un test E2E Playwright, ne pas répondre.');
    await page.locator('#contactForm .btn-submit').click();

    // Le bloc de succès apparaît, le formulaire se cache
    await expect(page.locator('#modalSuccess')).toHaveClass(/is-visible/);
    await expect(page.locator('#contactForm')).toBeHidden();
  });

  test('erreur serveur → message d\'erreur affiché', async ({ page }) => {
    // Simule un échec côté Formspree (500)
    await page.route(FORMSPREE, async (route) => {
      await route.fulfill({ status: 500, body: 'error' });
    });

    await page.fill('#nom', 'Test Erreur');
    await page.fill('#email', 'qa@example.com');
    await page.fill('#message', 'Test du chemin d\'erreur.');
    await page.locator('#contactForm .btn-submit').click();

    await expect(page.locator('#modalError')).toHaveClass(/is-visible/);
    await expect(page.locator('#modalSuccess')).not.toHaveClass(/is-visible/);
  });

  test('validation HTML5 : champs vides bloquent la soumission', async ({ page }) => {
    let appelReseau = false;
    await page.route(FORMSPREE, async (route) => {
      appelReseau = true;
      await route.fulfill({ status: 200, body: '{}' });
    });

    // On clique sans rien remplir
    await page.locator('#contactForm .btn-submit').click();

    // Le champ requis est invalide → aucune requête n'est partie
    const nomInvalide = await page.locator('#nom').evaluate(
      (el) => !el.checkValidity()
    );
    expect(nomInvalide).toBe(true);
    expect(appelReseau).toBe(false);
  });
});
