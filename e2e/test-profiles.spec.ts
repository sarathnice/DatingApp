import { test, expect } from "@playwright/test";

for (const man of ["Arjun", "Marcus", "Leo", "Ravi"]) {
  for (const woman of ["Maya", "Priya", "Hana", "Sofia"]) {
    test(`test pair ${man} and ${woman} shows both correct profiles`, async ({ page }) => {
      await page.goto("/");
      await page.locator("html[data-mila-ready='true']").waitFor();
      await page.getByRole("group", { name: "Male test profiles", exact: true }).getByRole("button", { name: man, exact: true }).click();
      await page.getByRole("button", { name: `${man} + ${woman}`, exact: true }).click();
      await expect(page.locator(".device-column.ios .profile-card h2")).toContainText(woman);
      await expect(page.locator(".device-column.android .profile-card h2")).toContainText(man);
      await expect(page.getByText(`Step 1 · ${man} messages ${woman}`)).toHaveCount(1);
      expect(await page.pageErrors()).toEqual([]);
    });
  }
}
