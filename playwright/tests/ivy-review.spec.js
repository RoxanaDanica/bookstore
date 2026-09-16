import { test, expect } from "@playwright/test";

test.describe("Ivy AI reviews", () => {
  test("Ivy can add a 5-star review to a book", async ({ page }) => {
    test.setTimeout(150000);
    await page.goto("/");
    await page
      .getByRole("button", {
        name: "Open Ivy assistant",
      })
      .click();

    await expect(
      page.getByText("Ivy", { exact: true }).first()
    ).toBeVisible({
      timeout: 10000,
    });

    const chatInput = page.getByPlaceholder(
      "Ask about a book..."
    );

    await expect(chatInput).toBeVisible();
    await page
      .getByRole("button", {
        name: "New chat",
      })
      .click();

    const bookTitle = "Harry Potter and the Chamber of Secrets (Book 2)";
    const reviewText = `Ivy Playwright review ${Date.now()}`;
    const message = `Give "${bookTitle}" 5 stars and write this review: "${reviewText}"`;

    await chatInput.fill(message);
    await page
      .getByRole("button", {
        name: "Send",
      })
      .click();

    await expect(
      page.getByText(message, {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByTestId("ivy-thinking")
    ).toBeVisible();

    await expect(
      page.getByTestId("ivy-thinking")
    ).toBeHidden({
      timeout: 120000,
    });

    await page
      .getByRole("button", {
        name: "Close chat",
      })
      .click();

    const searchInput = page.getByPlaceholder(
      "Search by title, author, ISBN..."
    );

    await searchInput.fill(bookTitle);
    await searchInput.press("Enter");

    await expect(page).toHaveURL(
      /\/books\/search\?q=/
    );

    const bookCard = page
      .getByTestId("book-card")
      .filter({
        has: page.getByRole("img", {
          name: bookTitle,
          exact: true,
        }),
      })
      .first();

    await expect(bookCard).toBeVisible({
      timeout: 10000,
    });

    await bookCard.click();

    await expect(
      page.getByRole("heading", {
        name: bookTitle,
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page.getByText(reviewText, {
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page.getByRole("heading", {
        name: "Customer Reviews",
      })
    ).toBeVisible();
  });
});