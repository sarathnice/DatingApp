import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => console.error(`Browser error: ${error.message}`));
  await page.goto("/");
  await page.locator("html[data-mila-ready='true']").waitFor();
});

test("opens the Mila preview and profile settings", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /A connection starts/i })).toBeVisible();
  await page
    .getByRole("navigation", { name: "ios preview pages" })
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "My profile" }).first()).toBeVisible();
  await expect(page.getByText("Discovery preferences").first()).toBeVisible();
});

test("gates a pre-match introduction with Mila Plus", async ({ page }) => {
  await page.getByRole("button", { name: /Send intro to/i }).first().click();
  await expect(page.getByText("Send an introduction before matching").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue/i }).first()).toBeVisible();
});
