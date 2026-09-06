import { defineConfig, devices } from "@playwright/test";

const stagingBaseUrl = process.env.MILA_BASE_URL;
const baseURL = stagingBaseUrl ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: stagingBaseUrl ? undefined : {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
