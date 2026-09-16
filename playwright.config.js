import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    /*
     * Normal E2E tests
     */
    {
      name: "chromium",

      use: {
        viewport: null,

        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },

    {
      name: "demo",

      use: {
        browserName: "chromium",
        viewport: {
          width: 1920,
          height: 1080,
        },
        video: {
          mode: "on",

          size: {
            width: 1920,
            height: 1080,
          },
        },

        launchOptions: {
          args: [
            "--window-size=1920,1080",
          ],
        },
      },
    },
  ],
});