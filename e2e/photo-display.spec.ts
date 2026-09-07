import { test, expect } from "@playwright/test";

test("mobile profile photos use separate proportional assets", async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready=true]").waitFor();
  const phone = page.locator(".device-column.ios");
  const photo = phone.locator(".profile-image");

  await expect(photo).toBeVisible();
  let styles = await photo.evaluate((element) => {
    const css = getComputedStyle(element);
    return { image: css.backgroundImage, size: css.backgroundSize, position: css.backgroundPosition };
  });
  expect(styles.image).toContain("/profiles/maya-1.jpg");
  expect(styles.size).toBe("cover");
  expect(styles.position).toContain("55%");

  await phone.getByRole("button", { name: "Next photo" }).click();
  styles = await photo.evaluate((element) => {
    const css = getComputedStyle(element);
    return { image: css.backgroundImage, size: css.backgroundSize, position: css.backgroundPosition };
  });
  expect(styles.image).toContain("/profiles/maya-2.jpg");
  expect(styles.size).toBe("cover");

  await phone.getByRole("button", { name: "View Maya's full profile" }).click();
  const hero = phone.locator(".full-profile-hero");
  await expect(hero).toBeVisible();
  const heroBox = await hero.boundingBox();
  const screenBox = await phone.locator(".phone-screen").boundingBox();
  expect(heroBox).not.toBeNull();
  expect(screenBox).not.toBeNull();
  expect(heroBox!.width).toBeLessThanOrEqual(screenBox!.width + 1);
  expect(heroBox!.height).toBeLessThan(screenBox!.height);
});

test("existing nearby profiles retain their own corrected photos", async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready=true]").waitFor();
  const phone = page.locator(".device-column.ios");
  const photo = phone.locator(".profile-image");

  await phone.getByRole("button", { name: "Next profile" }).click();
  await expect(phone.getByRole("heading", { name: "Priya, 31" })).toBeVisible();
  await expect.poll(() => photo.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain("/profiles/priya-1.jpg");

  await phone.getByRole("button", { name: "Next profile" }).click();
  await expect(phone.getByRole("heading", { name: "Hana, 29" })).toBeVisible();
  await expect.poll(() => photo.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain("/profiles/hana-1.jpg");
});

test("web profile photos use responsive cover crops without page overflow", async ({ page }) => {
  await page.goto("/web");
  await page.locator("html[data-mila-web-ready='true']").waitFor();
  const photo = page.locator(".web-profile-photo");
  await expect(photo).toBeVisible();
  const styles = await photo.evaluate((element) => {
    const css = getComputedStyle(element);
    return { image: css.backgroundImage, size: css.backgroundSize };
  });
  expect(styles.image).toContain("/profiles/maya-1.jpg");
  expect(styles.size).toBe("cover");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await page.locator(".web-mini-list").getByRole("button", { name: "View Priya, 30" }).click();
  await expect(page.locator(".web-photo-copy").getByRole("heading", { name: "Priya, 30" })).toBeVisible();
  await expect.poll(() => photo.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain("/profiles/priya-1.jpg");
});
