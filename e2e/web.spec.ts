import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/web");
  await page.locator("html[data-mila-web-ready='true']").waitFor();
});

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([]);
});

test("web discovery supports profile selection, favorite, and like", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Discover", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Maya, 29" })).toBeVisible();
  await page.getByRole("button", { name: "Save Maya favorite" }).click();
  await expect(page.getByRole("button", { name: "Remove Maya favorite" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Like Maya" }).click();
  await expect(page.getByRole("button", { name: "Maya liked" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("You liked Maya");
  await page.getByRole("button", { name: /Next profile/i }).click();
  await expect(page.getByRole("heading", { name: "Arjun, 31" })).toBeVisible();
});

test("web introduction explains the subscription gate", async ({ page }) => {
  await page.getByRole("button", { name: "Connect", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Meet Maya with an introduction/i })).toBeVisible();
  await expect(page.getByText(/included with Mila Plus/i)).toBeVisible();
  await page.getByRole("button", { name: "View Mila Plus" }).click();
  await expect(page.getByRole("status")).toContainText("Choose a Mila Plus plan");
});

test("web navigation adapts for likes and messages", async ({ page, isMobile }) => {
  const navigationName = isMobile ? "Mila mobile web navigation" : "Mila web navigation";
  const navigation = page.getByRole("navigation", { name: navigationName });
  await navigation.getByRole("button", { name: "Likes" }).click();
  await expect(page.getByRole("heading", { name: /profiles liked/i })).toBeVisible();
  await navigation.getByRole("button", { name: /Messages/i }).click();
  await expect(page.getByRole("heading", { name: "Your conversations" })).toBeVisible();
});

test("web layout stays usable without page-level horizontal overflow", async ({ page, isMobile }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  if (isMobile) {
    const navigation = page.getByRole("navigation", { name: "Mila mobile web navigation" });
    await expect(navigation).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Mila web navigation" })).toBeHidden();

    for (const name of ["Voice assistant", "Notifications", "Pass Maya", "Save Maya favorite", "Like Maya"]) {
      const box = await page.getByRole("button", { name }).boundingBox();
      expect(box, `${name} should have a rendered touch target`).not.toBeNull();
      expect(Math.min(box!.width, box!.height), `${name} should be at least 44px`).toBeGreaterThanOrEqual(44);
    }

    await page.getByRole("button", { name: "Next profile" }).scrollIntoViewIfNeeded();
    const navBox = await navigation.boundingBox();
    const nextBox = await page.getByRole("button", { name: "Next profile" }).boundingBox();
    expect(navBox).not.toBeNull();
    expect(nextBox).not.toBeNull();
    expect(nextBox!.y + nextBox!.height).toBeLessThanOrEqual(navBox!.y);
  } else {
    await expect(page.getByRole("navigation", { name: "Mila web navigation" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Mila mobile web navigation" })).toBeHidden();
    await expect(page.getByRole("textbox", { name: "Search interests or places" })).toBeVisible();
  }
});
