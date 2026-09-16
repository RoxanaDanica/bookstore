import { test, expect } from "@playwright/test";

test.describe("Ivy AI assistant", () => {
  test("Ivy can add a book to the cart", async ({ page }) => {
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

    const message = `Add "${bookTitle}" to my cart.`;

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

    await page
      .getByRole("link", {
        name: "View cart",
      })
      .click();

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
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });
  });
});