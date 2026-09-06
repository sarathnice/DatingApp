import { test, expect } from "@playwright/test";

for (const width of [360, 390, 430]) {
  for (const tab of ["Match", "Discover", "Likes", "Chats", "Profile"]) {
    test(`${width}px ${tab}: mobile layout and navigation`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/testing");
      await page.locator("html[data-mila-ready='true']").waitFor();
      const phone = page.locator(".device-column.ios");
      const navButton = phone.getByRole("navigation").getByRole("button", { name: new RegExp(`^${tab}(?: \\d+)?$`) });
      await navButton.click();
      await expect(navButton).toHaveAttribute("aria-current", "page");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const screen = phone.locator(".phone-screen");
      expect(await screen.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
      for (const label of ["Search profiles", "Discovery filters"]) {
        const box = await phone.getByRole("button", { name: label, exact: true }).boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.width).toBeGreaterThanOrEqual(44);
      }
      await phone.screenshot({ path: testInfo.outputPath(`${width}-${tab}.png`) });
      expect(await page.pageErrors()).toEqual([]);
    });
  }
}
