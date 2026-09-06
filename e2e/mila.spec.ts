import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready='true']").waitFor();
});

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([]);
});

test("reports a healthy staging service", async ({ page }) => {
  const response = await page.request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    service: "mila-dating-app",
  });
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

test("browses profile media and remembers a like during the session", async ({ page }) => {
  await page.getByRole("button", { name: "View Maya's full profile" }).click();
  const profile = page.locator(".full-profile").first();
  await expect(profile.getByText("Photo 1 · 1/4")).toBeVisible();
  await profile.getByRole("button", { name: "Next media" }).click();
  await expect(profile.getByText("Photo 2 · 2/4")).toBeVisible();
  await profile.getByRole("button", { name: "Like", exact: true }).click();
  await expect(profile.getByRole("button", { name: "Liked", exact: true })).toBeDisabled();
  await profile.getByRole("button", { name: "Close full profile" }).click();
  await page.getByRole("button", { name: "View Maya's full profile" }).click();
  await expect(page.locator(".full-profile").first().getByRole("button", { name: "Liked", exact: true })).toBeDisabled();
});
