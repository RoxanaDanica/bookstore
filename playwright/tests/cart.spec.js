import { test, expect } from "@playwright/test";

test.describe("Shopping cart", () => {
  test("user can add a book to the cart", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder(
      "Search by title, author, ISBN..."
    );

    await searchInput.fill("Harry Potter");
    await searchInput.press("Enter");

    await expect(page).toHaveURL(
      /\/books\/search\?q=Harry%20Potter/
    );

    const firstBook = page
      .getByTestId("book-card")
      .first();

    await expect(firstBook).toBeVisible({
      timeout: 10000,
    });

    const bookTitle = await firstBook
      .locator("img")
      .getAttribute("alt");

    expect(bookTitle).toBeTruthy();

    await firstBook.hover();

    const addToCartButton = firstBook.getByRole(
      "button",
      {
        name: "Add to cart",
      }
    );

    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await expect(
      firstBook.getByText("Added to cart")
    ).toBeVisible();

    await page
      .getByRole("link", {
        name: "View cart",
      }).click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(
      page.getByRole("heading", {
        name: "Shopping Cart",
      })
    ).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page.getByRole("heading", {
        name: bookTitle,
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Order Summary",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Go to Checkout",
      })
    ).toBeVisible();
  });
});