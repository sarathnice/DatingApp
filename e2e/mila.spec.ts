import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("html[data-mila-ready='true']").waitFor();
});

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([]);
});

test("discover spaces are visually grouped and open a matching feed", async ({ page }) => {
  await page.getByRole("button", { name: "Discover", exact: true }).first().click();

  await expect(page.getByRole("button", { name: /Long-term love/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Voice first/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Across borders/ }).first()).toBeVisible();

  await page.getByRole("button", { name: /New nearby/ }).first().click();
  await expect(page.getByRole("status").first()).toContainText("New nearby selected");
});

test("reports a healthy staging service", async ({ page }) => {
  const response = await page.request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    service: "mila-dating-app",
  });
});

test("mobile phone frame fits the viewport with aligned corners", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile geometry check");
  const frame = page.locator(".device-column.ios .compare-phone");
  const screen = page.locator(".device-column.ios .phone-screen");
  const grid = page.locator(".device-grid");

  const [frameBox, gridBox, frameRadius, screenRadius, pageWidth] = await Promise.all([
    frame.boundingBox(),
    grid.boundingBox(),
    frame.evaluate((element) => getComputedStyle(element).borderRadius),
    screen.evaluate((element) => getComputedStyle(element).borderRadius),
    page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth })),
  ]);

  expect(frameBox).not.toBeNull();
  expect(gridBox).not.toBeNull();
  expect(frameBox!.x).toBeGreaterThanOrEqual(15);
  expect(frameBox!.x + frameBox!.width).toBeLessThanOrEqual(pageWidth.viewport - 15);
  expect(gridBox!.width).toBeLessThanOrEqual(pageWidth.viewport);
  expect(pageWidth.scroll).toBe(pageWidth.viewport);
  expect(frameRadius).toBe("48px");
  expect(screenRadius).toBe("40px");
  expect(frameBox!.height / frameBox!.width).toBeGreaterThan(2.1);
  expect(frameBox!.height / frameBox!.width).toBeLessThan(2.2);
});

test("mobile overlay labels stay compact without losing their controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile sizing check");
  const ios = page.locator(".device-column.ios");
  const nearby = ios.locator(".nearby-on-photo span");
  const within = ios.locator(".nearby-on-photo button");
  const voice = ios.getByRole("button", { name: "Open Mila Voice" });

  await expect(nearby).toBeVisible();
  await expect(within).toBeVisible();
  await expect(voice).toBeVisible();

  const sizes = await Promise.all([nearby, within, voice].map(async (item) => ({
    box: await item.boundingBox(),
    font: await item.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  })));
  expect(sizes[0].box!.height).toBeLessThanOrEqual(31);
  expect(sizes[1].box!.height).toBeLessThanOrEqual(37);
  expect(sizes[2].box!.height).toBeLessThanOrEqual(37);
  expect(Math.max(...sizes.map((size) => size.font))).toBeLessThanOrEqual(11);
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

test("header filter shortcut opens preferences and keeps changes", async ({ page }) => {
  const ios = page.locator(".device-column.ios");
  await ios.getByRole("button", { name: "Discovery filters" }).click();
  await expect(ios.getByText("Find people who fit your life")).toBeVisible();

  await ios.getByRole("slider", { name: "Maximum distance" }).fill("24");
  await ios.getByRole("combobox").first().selectOption("Everyone");
  await ios.getByRole("button", { name: "Save" }).click();

  await ios.getByRole("navigation", { name: "ios preview pages" }).getByRole("button", { name: "Profile" }).click();
  await expect(ios.getByText(/24 mi · Ages .* · Everyone/)).toBeVisible();
});

test("settings hub covers account, discovery, safety, and notifications", async ({ page }) => {
  const ios = page.locator(".device-column.ios");
  await ios.getByRole("navigation", { name: "ios preview pages" }).getByRole("button", { name: "Profile" }).click();
  await ios.getByRole("button", { name: /Settings & safety/i }).click();

  await expect(ios.getByText("Arjun's account")).toBeVisible();
  await expect(ios.getByText("Discovery & visibility")).toBeVisible();
  await expect(ios.getByText("Privacy & safer conversations")).toBeVisible();
  await expect(ios.getByText("Notifications & media")).toBeVisible();

  const discovery = ios.getByRole("switch", { name: "Enable discovery" });
  await expect(discovery).toBeChecked();
  await discovery.click();
  await expect(discovery).not.toBeChecked();
  await expect(ios.getByText("Your profile is hidden; matched chats stay open.")).toBeVisible();

  await ios.getByRole("combobox", { name: "Profile visibility" }).selectOption("Incognito");
  await ios.getByRole("combobox", { name: "Recommendation order" }).selectOption("Recently active");
  await ios.getByRole("switch", { name: "Verified-only messages" }).click();
  await expect(ios.getByRole("switch", { name: "Verified-only messages" })).toBeChecked();
  await ios.getByRole("button", { name: "Done" }).click();
  await expect(ios.getByRole("heading", { name: "My profile" })).toBeVisible();
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

test("Arjun and Maya can mutually like, match, and exchange messages", async ({ page }) => {
  const ios = page.locator(".device-column.ios");
  const android = page.locator(".device-column.android");

  await page.getByRole("group", { name: "Test profile scenario" }).getByRole("button", { name: "Arjun + Maya" }).click();
  await ios.getByRole("button", { name: "Like Maya" }).click();
  await android.getByRole("button", { name: "Like Arjun" }).click();
  await expect(ios.getByText("It’s a match!")).toBeVisible();

  await ios.getByRole("navigation", { name: "ios preview pages" }).getByRole("button", { name: "Chats" }).click();
  await expect(android.getByText("Connected · Messages are now open")).toBeVisible();

  await ios.getByRole("textbox", { name: "Message Maya" }).fill("Hi Maya, would you like to visit the design museum this weekend?");
  await ios.getByRole("button", { name: "Send message" }).click();
  await expect(android.getByText("Hi Maya, would you like to visit the design museum this weekend?")).toBeVisible();

  await android.getByRole("textbox", { name: "Message Arjun" }).fill("Yes, Saturday afternoon works well for me.");
  await android.getByRole("button", { name: "Send message" }).click();
  await expect(ios.getByText("Yes, Saturday afternoon works well for me.")).toBeVisible();
  await expect(ios.getByText("Relationship Journey")).toBeVisible();
});

test("Arjun sends Priya a contextual introduction and Priya accepts", async ({ page }) => {
  const ios = page.locator(".device-column.ios");
  const android = page.locator(".device-column.android");

  await page.getByRole("group", { name: "Test profile scenario" }).getByRole("button", { name: "Arjun + Priya" }).click();
  await ios.getByRole("button", { name: "Send intro to Priya" }).click();
  await expect(ios.getByText("Send an introduction before matching", { exact: true })).toBeVisible();
  await ios.getByRole("button", { name: "Continue" }).click();

  const intro = ios.getByRole("textbox", { name: "Introduction to Priya" });
  await expect(intro).toBeVisible();
  await intro.fill("Hi Priya, your Sunday market tradition sounds lovely. What is your favorite place for filter coffee?");
  await expect(ios.getByText("Strong · personal and specific")).toBeVisible();
  await expect(ios.getByText("Intent aligns")).toBeVisible();
  await ios.getByRole("button", { name: "Send connection" }).click();

  await android.getByRole("navigation", { name: "android preview pages" }).getByRole("button", { name: "Likes" }).click();
  await expect(android.getByText("Arjun sent an introduction")).toBeVisible();
  await android.getByRole("button", { name: "Accept & chat" }).click();
  await expect(android.getByText("Connected · Messages are now open")).toBeVisible();
  await android.getByRole("textbox", { name: "Message Arjun" }).fill("I would enjoy that. Let’s compare our favorite cafés.");
  await android.getByRole("button", { name: "Send message" }).click();
  await expect(ios.getByText("I would enjoy that. Let’s compare our favorite cafés.")).toBeVisible();
});

test("Hana can decline an introduction without opening chat", async ({ page }) => {
  const ios = page.locator(".device-column.ios");
  const android = page.locator(".device-column.android");

  await page.getByRole("group", { name: "Test profile scenario" }).getByRole("button", { name: "Arjun + Hana" }).click();
  await ios.getByRole("button", { name: "Send intro to Hana" }).click();
  await ios.getByRole("button", { name: "Continue" }).click();
  await ios.getByRole("textbox", { name: "Introduction to Hana" }).fill("Hi Hana, I also enjoy documentaries. Which recent story stayed with you?");
  await ios.getByRole("button", { name: "Send connection" }).click();

  await android.getByRole("navigation", { name: "android preview pages" }).getByRole("button", { name: "Likes" }).click();
  await android.getByRole("button", { name: "Decline" }).click();
  await expect(android.getByText("Introduction declined. No chat was opened.")).toBeVisible();
  await android.getByRole("navigation", { name: "android preview pages" }).getByRole("button", { name: "Chats" }).click();
  await expect(android.getByText("Both people must like each other first.")).toBeVisible();
});

test("Phase 3 relationship controls save capacity, life mode, and boundaries", async ({ page }) => {
  const ios = page.locator(".device-column.ios");
  await ios.getByRole("navigation", { name: "ios preview pages" }).getByRole("button", { name: "Profile" }).click();
  await ios.getByRole("button", { name: /Mila relationship controls/i }).click();
  await expect(ios.getByText("Your pace, your boundaries")).toBeVisible();
  await ios.getByRole("slider", { name: "Connection capacity" }).fill("2");
  await expect(ios.getByText("2 active")).toBeVisible();
  await ios.getByRole("combobox", { name: "Life Change Mode" }).selectOption("Limited availability");
  await ios.getByRole("switch", { name: "Allow temporary location sharing" }).click();
  await expect(ios.getByRole("switch", { name: "Allow temporary location sharing" })).toBeChecked();
  await ios.getByRole("button", { name: "Save" }).click();
  await expect(ios.getByText("Your pace, your boundaries")).toBeHidden();
});
