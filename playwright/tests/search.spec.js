import { test, expect } from "@playwright/test";

test.describe("Book search", () => {
  test("user can search for books from the header", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("Search by title, author, ISBN...");

    await expect(searchInput).toBeVisible();
    await searchInput.fill("Harry Potter");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/books\/search\?q=Harry%20Potter/);

    await expect(
      page.getByRole("heading", {
        name: 'Results for “Harry Potter”',
      })
    ).toBeVisible();
    const addToCartButtons = page.getByRole(
      "button",
      { name: "Add to cart" }
    );

    await expect(
      addToCartButtons.first()
    ).toBeAttached({
      timeout: 10000,
    });

    expect(
      await addToCartButtons.count()
    ).toBeGreaterThan(0);

    const harryPotterCovers = page.getByRole(
      "img",
      { name: /Harry Potter/i }
    );

    await expect(
      harryPotterCovers.first()
    ).toBeVisible({
      timeout: 10000,
    });

    await expect(
      searchInput
    ).toHaveValue("Harry Potter");
  });
});