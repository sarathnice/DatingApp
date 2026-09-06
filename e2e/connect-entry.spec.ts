import { test, expect } from "@playwright/test";

for (const entry of ["Connect with Maya", "Connect with Maya about their story", "Connect with Maya from profile actions"]) {
  test(`${entry} opens the same connection flow`, async ({ page }, info) => {
    await page.goto("/");
    await page.locator("html[data-mila-ready=true]").waitFor();
    const phone = page.locator(".device-column.ios");
    await phone.getByRole("button", { name: "View Maya's full profile" }).click();
    const full = phone.locator(".full-profile");
    await expect(full.getByRole("button", { name: /^Connect with Maya/ })).toHaveCount(3);
    await full.screenshot({ path: info.outputPath("full-profile.png") });
    await full.getByRole("button", { name: entry, exact: true }).click();
    await expect(phone.getByText("Send an introduction before matching", { exact: true })).toBeVisible();
    await phone.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(phone.getByRole("textbox", { name: "Introduction to Maya" })).toBeVisible();
    await expect(phone.getByLabel("Maya's profile pages")).toBeVisible();
    expect(await page.pageErrors()).toEqual([]);
  });
}
