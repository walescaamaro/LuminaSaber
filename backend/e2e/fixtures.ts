import { test as base, expect } from '@playwright/test';

const allowedOrigin = new URL(process.env.BASE_URL ?? `http://127.0.0.1:${process.env.PORT ?? '4317'}`).origin;

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', async (route) => {
      const requestUrl = route.request().url();
      let requestOrigin: string;

      try {
        requestOrigin = new URL(requestUrl).origin;
      } catch {
        await route.abort('blockedbyclient');
        return;
      }

      if (requestOrigin === allowedOrigin) {
        await route.continue();
      } else {
        await route.abort('blockedbyclient');
      }
    });
    await use(page);
  },
});

export { expect };
