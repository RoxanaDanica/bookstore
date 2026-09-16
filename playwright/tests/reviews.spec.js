import { test, expect } from "@playwright/test";

test.describe("Book reviews", () => {
  test("user can add a review to a book", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("Search by title, author, ISBN...");
    await searchInput.fill("Harry Potter");
    await searchInput.press("Enter");

    const firstBook = page
      .getByTestId("book-card")
      .first();

    await expect(firstBook).toBeVisible({
      timeout: 10000,
    });

    const bookTitle = await firstBook.locator("img").getAttribute("alt");
    expect(bookTitle).toBeTruthy();

    await firstBook.click();
    await expect(page).toHaveURL(/\/books\/\d+/);
    await expect(
      page.getByRole("heading", {
        name: bookTitle,
        exact: true,
      })
    ).toBeVisible();
    const reviewInput = page.getByPlaceholder("What did you think about this book?");

    await reviewInput.scrollIntoViewIfNeeded();

    await page
      .getByRole("button", {
        name: "5 star rating",
      })
      .click();
    const reviewText =`Playwright review ${Date.now()} - Absolutely loved the story and characters.`;

    await reviewInput.fill(reviewText);
    const submitButton = page.getByRole(
      "button",
      {
        name: "Submit review",
      }
    );

    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await expect(
      page.getByText(reviewText, {
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });
  });
});