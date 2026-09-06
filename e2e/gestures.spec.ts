import { test, expect } from "@playwright/test";

for (const platform of ["ios", "android"]) {
  for (const direction of ["left", "right", "up", "down"]) {
    test(`${platform} mouse drag ${direction} browses a different person`, async ({ page }) => {
      await page.goto("/");
      await page.locator("html[data-mila-ready='true']").waitFor();
      const phone = page.locator(`.device-column.${platform}`);
      const card = phone.locator(".profile-card");
      await card.scrollIntoViewIfNeeded();
      const before = await card.locator("h2").innerText();
      const box = (await card.boundingBox())!;
      const x = box.x + box.width * .65, y = box.y + box.height * .45;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + (direction === "left" ? -110 : direction === "right" ? 110 : 0), y + (direction === "up" ? -110 : direction === "down" ? 110 : 0), { steps: 12 });
      await expect(phone.locator(".gesture-feedback")).toBeVisible();
      await page.mouse.up();
      await expect(card.locator("h2")).not.toHaveText(before);
      await expect(phone.locator(".full-profile")).toHaveCount(0);
      expect(await page.pageErrors()).toEqual([]);
    });
  }
}

test("native touch swipe moves to next profile", async ({ page, context }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready='true']").waitFor();
  const card = page.locator(".device-column.ios .profile-card");
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  const before = await card.locator("h2").innerText();
  const session = await context.newCDPSession(page);
  const x = box.x + box.width * .6, y = box.y + box.height * .5;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let n = 1; n <= 8; n++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - n * 15 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(card.locator("h2")).not.toHaveText(before);
});

test("single profile explains distance limit when Next is pressed", async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready='true']").waitFor();
  const phone = page.locator(".device-column.ios");
  await phone.getByRole("button", { name: "Discovery filters" }).click();
  await phone.getByRole("slider", { name: "Maximum distance" }).fill("5");
  await phone.getByRole("button", { name: "Save", exact: true }).click();
  await phone.getByRole("button", { name: "Next profile", exact: true }).click();
  await expect(phone.getByText("Only one profile within this distance. Increase your distance to meet more people.")).toBeVisible();
});
