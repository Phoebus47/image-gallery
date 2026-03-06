import { expect, test } from '@playwright/test';

// To see the browser state: run `npm run test:e2e` then `npm run test:e2e:report`,
// or in UI mode expand a test and click a step after "Navigate" in the trace.

test.describe('Image Gallery', () => {
  test('displays gallery title and images', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /image gallery/i }),
    ).toBeVisible();
    // Wait for initial fetch + render (list appears after useImagePool resolves)
    await expect(page.getByRole('list', { name: /image grid/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole('button', { name: /view.*full screen/i }).first(),
    ).toBeVisible();

    await testInfo.attach('gallery-page', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('filters images when clicking hashtag', async ({ page }) => {
    await page.goto('/');

    const firstHashtag = page.getByRole('button', { name: /^#/ }).first();
    await firstHashtag.click();

    await expect(page.getByRole('status')).toContainText('Filtering by');
  });

  test('clears filter when clicking clear button', async ({ page }) => {
    await page.goto('/');

    const firstHashtag = page.getByRole('button', { name: /^#/ }).first();
    await firstHashtag.click();

    await expect(page.getByRole('status')).toBeVisible();

    await page.getByRole('button', { name: /clear filter/i }).click();

    await expect(page.getByRole('status')).not.toBeVisible();
  });

  test('opens lightbox when clicking image', async ({ page }) => {
    await page.goto('/');

    const firstImage = page
      .getByRole('button', { name: /view.*full screen/i })
      .first();
    await firstImage.click();

    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('back-to-top button appears on scroll and scrolls to top when clicked', async ({
    page,
  }, testInfo) => {
    testInfo.setTimeout(45_000); // smooth scroll + waits may need extra time
    await page.goto('/');
    await expect(page.getByRole('list', { name: /image grid/i })).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(
      page.getByRole('button', { name: /back to top/i }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: /back to top/i })
      .click({ force: true });
    // Smooth scroll can take several seconds on a long page
    await page.waitForFunction(() => window.scrollY < 100, { timeout: 15_000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('infinite scroll loads more images when scrolling to bottom', async ({
    page,
  }) => {
    await page.goto('/');
    const list = page.getByRole('list', { name: /image grid/i });
    await expect(list).toBeVisible({ timeout: 15_000 });

    const initialCards = await page.getByTestId('gallery-card').count();

    await page.getByTestId('scroll-sentinel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const afterScrollCards = await page.getByTestId('gallery-card').count();
    const reachedEnd = page.getByText(/you've reached the end/i);
    expect(
      afterScrollCards > initialCards || (await reachedEnd.isVisible()),
    ).toBeTruthy();
  });

  test('mobile viewport shows floating filter pill when hashtag is selected', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('list', { name: /image grid/i })).toBeVisible();

    const firstHashtag = page.getByRole('button', { name: /^#/ }).first();
    await firstHashtag.click();

    const filterSection = page.getByRole('region', {
      name: /browse & filter by hashtags/i,
    });
    await expect(filterSection).toBeVisible();
    await expect(filterSection).toHaveClass(/fixed/);
  });

  test('theme toggle updates document data-theme', async ({ page }) => {
    await page.goto('/');

    const themeTrigger = page.getByRole('button', {
      name: /theme \(light, dark, or system\)/i,
    });
    await themeTrigger.click();
    await page.getByRole('menuitem', { name: /^dark$/i }).click();

    await expect(
      page.evaluate(() => document.documentElement.getAttribute('data-theme')),
    ).resolves.toBe('dark');

    await themeTrigger.click();
    await page.getByRole('menuitem', { name: /^light$/i }).click();

    await expect(
      page.evaluate(() => document.documentElement.getAttribute('data-theme')),
    ).resolves.toBe('light');
  });

  test('square filter shows only square images when toggled', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('list', { name: /image grid/i })).toBeVisible({
      timeout: 15_000,
    });

    const allCards = await page.getByTestId('gallery-card').count();

    const squareBtn = page.getByRole('button', {
      name: /show square images only/i,
    });
    await expect(squareBtn).toHaveAttribute('aria-pressed', 'false');

    await squareBtn.click();
    await expect(squareBtn).toHaveAttribute('aria-pressed', 'true');

    // Wait and verify all displayed images are square
    await expect(async () => {
      const images = await page
        .getByRole('img', { name: /gallery image/i })
        .all();
      expect(images.length).toBeGreaterThan(0); // Ensure grid isn't empty

      for (const img of images) {
        const width = await img.getAttribute('width');
        const height = await img.getAttribute('height');
        expect(width).toBeTruthy();
        expect(width).toBe(height);
      }
    }).toPass();

    await squareBtn.click();
    await expect(squareBtn).toHaveAttribute('aria-pressed', 'false');

    // Verify non-square images return
    await expect(async () => {
      const images = await page
        .getByRole('img', { name: /gallery image/i })
        .all();
      let hasNonSquare = false;
      for (const img of images) {
        const width = await img.getAttribute('width');
        const height = await img.getAttribute('height');
        if (width !== height) {
          hasNonSquare = true;
          break;
        }
      }
      expect(hasNonSquare).toBe(true);
    }).toPass();
  });
});
