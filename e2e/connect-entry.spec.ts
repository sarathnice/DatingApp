import { test, expect } from "@playwright/test";

test("home Connect icon uses the modern outline mark", async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready=true]").waitFor();
  const connect = page.locator(".device-column.ios").getByRole("button", { name: "Connect with Maya", exact: true });
  await expect(connect.locator(".mila-connect-mark")).toHaveAttribute("data-filled", "false");
  const styles = await connect.evaluate((element) => {
    const button = getComputedStyle(element);
    const icon = getComputedStyle(element.querySelector("svg")!);
    return { background: button.backgroundColor, color: button.color, iconWidth: Number.parseFloat(icon.width), iconColor: icon.color };
  });
  expect(styles.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(styles.color).not.toBe("rgb(255, 255, 255)");
  expect(styles.iconColor).toBe(styles.color);
  expect(styles.iconWidth).toBeGreaterThanOrEqual(23);
});

test("Connect fills the handshake after the request is sent", async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready=true]").waitFor();
  const phone = page.locator(".device-column.ios");
  await phone.getByRole("button", { name: "Connect with Maya", exact: true }).click();
  await phone.getByRole("button", { name: "Continue", exact: true }).click();
  await phone.getByRole("button", { name: "Send connection", exact: true }).click();

  const sent = phone.getByRole("button", { name: "Connection sent to Maya", exact: true });
  await expect(sent).toBeVisible({ timeout: 400 });
  await expect(sent).toBeDisabled();
  await expect(sent.locator(".mila-connect-mark")).toHaveAttribute("data-filled", "true");
  await expect(sent.getByText("Sent", { exact: true })).toBeVisible();
});

for (const entry of ["Connect with Maya", "Connect with Maya about their story", "Connect with Maya from profile actions"]) {
  test(`${entry} opens the same connection flow`, async ({ page }, info) => {
    await page.goto("/");
    await page.locator("html[data-mila-ready=true]").waitFor();
    const phone = page.locator(".device-column.ios");
    await phone.getByRole("button", { name: "View Maya's full profile" }).click();
    const full = phone.locator(".full-profile");
    await expect(full.getByRole("button", { name: /^Connect with Maya/ })).toHaveCount(3);
    for (const button of await full.getByRole("button", { name: /^Connect with Maya/ }).all()) {
      await expect(button.locator(".mila-connect-mark")).toHaveAttribute("data-filled", "false");
    }
    await full.screenshot({ path: info.outputPath("full-profile.png") });
    await full.getByRole("button", { name: entry, exact: true }).click();
    await expect(phone.getByText("Send an introduction before matching", { exact: true })).toBeVisible();
    await phone.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(phone.getByRole("textbox", { name: "Introduction to Maya" })).toBeVisible();
    await expect(phone.getByLabel("Maya's profile pages")).toBeVisible();
    expect(await page.pageErrors()).toEqual([]);
  });
}
