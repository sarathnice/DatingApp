import { test, expect } from "@playwright/test";

for (const width of [360, 390, 430]) {
  test(`${width}px Signature opens directly and navigates all four destinations`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await page.locator("html[data-mila-ready=true]").waitFor();
    const phone = page.locator(".device-column.ios");
    const nav = phone.getByRole("navigation");
    await expect(nav.getByRole("button")).toHaveCount(4);
    await expect(page.locator(".preview-controls")).toBeHidden();
    await expect(page.locator(".device-column.android")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const box = (await phone.locator(".compare-phone").boundingBox())!;
    expect(box.y).toBe(0);
    expect(box.width).toBe(width);
    expect(box.height).toBe(800);
    for (const label of ["Discover", "Likes", "Chats", "You"]) {
      await nav.getByRole("button", { name: new RegExp(`^${label}`) }).click();
      await expect(nav.getByRole("button", { name: new RegExp(`^${label}`) })).toHaveAttribute("aria-current", "page");
      await page.screenshot({ path: info.outputPath(`${width}-${label}.png`) });
    }
    await expect(phone.getByRole("link", { name: "Open demo testing studio" })).toHaveAttribute("href", "/testing");
    expect(await page.pageErrors()).toEqual([]);
  });
}

test("Signature collections, profile story, connect gating and voice shortcuts", async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready=true]").waitFor();
  const phone = page.locator(".device-column.ios");
  await phone.getByRole("button", { name: "Explore interests", exact: true }).click();
  await expect(phone.locator(".explore-copy small").first()).toBeHidden();
  await phone.getByRole("button", { name: /Across borders/ }).click();
  await expect(phone.locator(".profile-card h2")).toContainText("Sofia");
  await phone.getByRole("button", { name: "View Sofia's full profile" }).click();
  await expect(phone.getByText("Everyday life", { exact: true })).toBeVisible();
  await expect(phone.getByText("Life in pictures", { exact: true })).toBeVisible();
  await expect(phone.locator(".signature-photo-story [role=img]")).toHaveCount(3);
  await phone.getByRole("button", { name: "Maybe later", exact: true }).click();
  await phone.getByRole("button", { name: "Send intro to Sofia", exact: true }).click();
  await expect(phone.getByText("Mila Plus", { exact: true }).first()).toBeVisible();
  await page.reload();
  await phone.getByRole("button", { name: "Open Mila Voice" }).click();
  const choices = phone.getByRole("group", { name: "Ask Mila actions" });
  await expect(choices.getByRole("button")).toHaveCount(3);
  await choices.getByRole("button", { name: "Reply", exact: true }).click();
  await expect(phone.getByRole("button", { name: "Confirm & send reply" })).toBeDisabled();
  expect(await page.pageErrors()).toEqual([]);
});
