import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage has the public shell and no detectable a11y violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "Heritage Hack Club introduction" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible();

  const topbar = page.locator(".desktop-topbar");
  if (await topbar.isVisible()) {
    await expect(
      topbar.getByRole("link", { name: "@heritagehackclub" }),
    ).toBeVisible();
    await expect(
      topbar.getByRole("link", { name: "heritagehackclub@gmail.com" }),
    ).toBeVisible();
    await expect(
      topbar.getByRole("link", { name: "Apply for a profile" }),
    ).toHaveAttribute("href", /^(mailto:|https:)/);
    await expect(topbar.getByRole("link", { name: "Admin" })).toHaveAttribute(
      "href",
      "/admin",
    );
  }

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("desktop navigation becomes a compact icon rail and keeps official glyph geometry", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop navigation rail");
  await page.goto("/");

  const shell = page.locator(".site-shell");
  const sidebar = page.getByRole("complementary", {
    name: "Primary navigation",
  });
  await expect(page.locator(".nav-item svg").first()).toHaveAttribute(
    "viewBox",
    "0 0 32 32",
  );
  await expect(page.locator(".nav-item svg path").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Heritage Hack Club home" }),
  ).toHaveClass(/brand-signature/);

  await page.getByRole("button", { name: "Collapse navigation" }).click();
  await expect(shell).toHaveAttribute("data-sidebar-collapsed", "true");
  await expect(
    page.getByRole("button", { name: "Expand navigation" }),
  ).toBeVisible();
  await expect
    .poll(async () => (await sidebar.boundingBox())?.width)
    .toBeLessThan(100);

  await page.getByRole("button", { name: "Expand navigation" }).click();
  await expect(shell).toHaveAttribute("data-sidebar-collapsed", "false");
});

test("homepage story can autoplay, pause, and move with explicit controls", async ({
  page,
}) => {
  await page.goto("/");
  const heading = page.locator(".home-story h1");
  await page
    .getByRole("button", {
      name: "Show story 1: Welcome to Heritage Hack Club!",
    })
    .click();
  await expect(heading).toHaveText("Welcome to Heritage Hack Club!");
  await expect(page.locator(".home-story-label")).toHaveCount(0);
  await expect(
    page.locator(".home-story-progress").getByRole("button"),
  ).toHaveCount(5);
  await expect(page.locator(".home-story-progress")).toHaveAttribute(
    "style",
    /repeat\(5, minmax\(0, 1fr\)\)/,
  );
  const progressRows = await page
    .locator(".home-story-progress")
    .getByRole("button")
    .evaluateAll((buttons) =>
      buttons.map((button) => Math.round(button.getBoundingClientRect().top)),
    );
  expect(new Set(progressRows).size).toBe(1);

  await expect
    .poll(async () => heading.textContent(), { timeout: 8000 })
    .not.toBe("Welcome to Heritage Hack Club!");

  await page.getByRole("button", { name: "Pause automatic slides" }).click();
  const pausedHeading = await heading.textContent();
  await expect(
    page.getByRole("button", { name: "Resume automatic slides" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Next story" }).click();
  await expect(heading).not.toHaveText(pausedHeading ?? "");
});

test("member portfolio presents interests and credited work without social-network actions", async ({
  page,
}) => {
  await page.goto("/people/sample-member-01");

  await expect(
    page.getByRole("heading", { name: "Sample member 01" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Who I am and what I care about" }),
  ).toBeVisible();
  await expect(page.getByText("Sample member profile")).toBeVisible();
  await expect(
    page.getByText("A project portfolio, not a social network."),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: /connect/i })).toHaveCount(0);
  await expect(
    page.getByLabel("Sample member 01 has not added a profile photo"),
  ).toBeVisible();

  await page.getByRole("link", { name: /Sample project 01/i }).click();
  await expect(page).toHaveURL(/\/projects\/sample-project-01$/);
  await expect(
    page.getByRole("heading", { name: "Sample project 01", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Who made what")).toBeVisible();
  await expect(page).toHaveTitle(/Sample project 01/);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("project credits link back to member portfolios", async ({ page }) => {
  await page.goto("/projects/sample-project-01");
  await page.getByRole("link", { name: /Sample member 01/ }).click();
  await expect(page).toHaveURL(/\/people\/sample-member-01$/);
  await expect(
    page.getByRole("heading", { name: "Things I helped make" }),
  ).toBeVisible();
});

test("member portfolio remains complete on mobile without profile media", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile layout");
  await page.goto("/people/sample-member-01");

  await expect(
    page.getByRole("heading", { name: "Sample member 01" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /View my work/ })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Things I helped make" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("mobile drawer opens, traps focus, closes with Escape, and restores focus", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile behavior");
  await page.goto("/");

  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  const primaryNavigation = page.getByRole("complementary", {
    name: "Primary navigation",
  });
  await expect(primaryNavigation).toHaveAttribute("data-open", "true");
  const closeButton = page
    .getByRole("button", { name: "Close navigation" })
    .last();
  await expect(closeButton.locator("svg")).toBeVisible();
  await expect(closeButton).not.toHaveText("×");
  const mobileUtilities = primaryNavigation.locator(".sidebar-utility-links");
  await expect(
    mobileUtilities.getByRole("link", { name: "Apply for a profile" }),
  ).toBeVisible();
  await expect(
    mobileUtilities.getByRole("link", { name: "@heritagehackclub" }),
  ).toBeVisible();
  await expect(
    mobileUtilities.getByRole("link", { name: "Email the club" }),
  ).toHaveAttribute("href", "mailto:heritagehackclub@gmail.com");
  await expect(
    mobileUtilities.getByRole("link", { name: "Admin editor" }),
  ).toHaveAttribute("href", "/admin");

  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Dark appearance" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(primaryNavigation).toHaveAttribute("data-open", "false");
  await expect(menu).toBeFocused();
});

test("admin project document supports block, contributor, profile, and preview workflows", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Full editor workflow is covered on desktop");
  await page.goto("/admin");
  const title = page.getByLabel("Project title");
  await expect(title).toHaveValue("Untitled project");
  await title.fill("Sample editor demo");
  await expect(page.getByText("Unsaved changes")).toBeVisible();

  await page.getByRole("button", { name: /Add section/ }).click();
  await page.getByRole("button", { name: /Tools & technology/ }).click();
  await expect(
    page.getByRole("heading", { name: "Tools & technology" }),
  ).toBeVisible();

  const initialOrder = await page
    .locator(".project-document-block .document-block-toolbar h2")
    .allTextContents();
  await page.getByRole("button", { name: "Move Story down" }).click();
  const movedOrder = await page
    .locator(".project-document-block .document-block-toolbar h2")
    .allTextContents();
  expect(movedOrder[0]).not.toBe(initialOrder[0]);

  await page.getByRole("button", { name: /Add contributor credit/ }).click();
  await page.getByRole("button", { name: /Add unlinked person/ }).click();
  await page.getByLabel("Role").fill("Sample role");
  await page
    .getByLabel("Contribution")
    .fill("A clear description of this sample contribution.");
  await page.getByRole("button", { name: "Add credit" }).click();
  await expect(page.getByText("Contributor name").first()).toBeVisible();

  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(
    page.getByRole("article", { name: "Project page preview" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("article", { name: "Project page preview" })
      .getByRole("heading", { name: "Sample editor demo" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit", exact: true }).click();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("mobile editor exposes the inspector as a reachable sheet", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile behavior");
  await page.goto("/admin");

  const inspectorButton = page.getByRole("button", { name: /Inspector/ });
  await inspectorButton.click();
  const inspector = page.locator(".project-inspector");
  await expect(inspector).toHaveAttribute("data-open", "true");
  await expect(
    inspector.getByRole("heading", { name: "Page outline" }),
  ).toBeVisible();
  await inspector
    .getByRole("button", { name: "Close project inspector" })
    .click();
  await expect(inspector).toHaveAttribute("aria-hidden", "true");
  await expect(inspectorButton).toBeFocused();
});
