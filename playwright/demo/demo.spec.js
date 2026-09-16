import { test, expect } from "@playwright/test";

test.describe("Ivory & Ink demo", () => {
  test("60 second bookstore demo", async ({ page }) => {
    test.setTimeout(120000);

    const bookTitle = "Harry Potter and the Order of the Phoenix (Book 5)";
    const searchTitle = "Harry Potter and the Order of the Phoenix (Book 5)"; 
    const reviewText = "A captivating story with memorable characters.";

    //Helpers
    const pause = (ms) => page.waitForTimeout(ms);
    const humanPause = async (min = 120, max = 350) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    await page.waitForTimeout(ms);
    };

    const moveTo = async (locator, steps = 18) => {
    const box = await locator.boundingBox();

    if (!box) return;
        await page.mouse.move(
            box.x + box.width / 2,
            box.y + box.height / 2,
            { steps }
        );
    };

    const humanClick = async (locator) => {
        await moveTo(locator);
        await humanPause(120, 260);
        await locator.click();
        await humanPause(180, 350);
    };

    const humanType = async ( locator, text, minDelay = 25, maxDelay = 55 ) => {
        await moveTo(locator);
        await humanPause(100, 220);
        await locator.click();

        for (const char of text) {
            await locator.press(char);

            await page.waitForTimeout(
            Math.floor(
                Math.random() *
                (maxDelay - minDelay + 1)
            ) + minDelay
            );
        }

        await humanPause(150, 300);
    };

    const humanWheel = async (amount, steps = 4 ) => {
        const perStep = amount / steps;

        for (let i = 0; i < steps; i++) {
            await page.mouse.wheel(0, perStep);
            await humanPause(180, 300);
        }
    };

    const smoothScrollTo = async ( y, wait = 900 ) => {
      await page.evaluate((targetY) => {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }, y);
      await pause(wait);
    };

    const smoothScrollToPercent = async ( percent, wait = 900 ) => {
      await page.evaluate(
        (targetPercent) => {
          const maxScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

          window.scrollTo({
            top: maxScroll * targetPercent,
            behavior: "smooth",
          });
        },
        percent
      );
      await pause(wait);
    };

    const smoothScrollToElement = async ( locator, wait = 900 ) => {
      await locator.evaluate((element) => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });

      await pause(wait);
    };

    // Mock only Ivy's AI response
    // Cart + reviews still use the REAL Express backend and the REAL database.

    let ivyRequest = 0;

    await page.route( "**/api/chat",
      async (route) => {
        if (
          route.request().method() !== "POST"
        ) {
          return route.continue();
        }

        ivyRequest++;
        const headers = route.request().headers();
        const authorization = headers.authorization;

        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (ivyRequest === 1) {
          const searchResponse = await page.request.get(`http://localhost:3000/api/books/search?title=${encodeURIComponent(bookTitle)}`);
          expect(searchResponse.ok()).toBeTruthy();

          const books = await searchResponse.json();
          const normalizedTitle = bookTitle.trim().toLowerCase();
          const book = books.find((item) =>item.title?.trim().toLowerCase() === normalizedTitle) ?? books[0];

          expect(book).toBeTruthy();

        //Cart request
          const cartResponse =
            await page.request.post( "http://localhost:3000/api/cart/items",
              {
                headers: {
                  Authorization:
                    authorization,
                },

                data: {
                  bookId: book.id,
                  quantity: 1,
                },
              }
            );

          expect(cartResponse.ok()).toBeTruthy();

        //Mock ivy response
          return route.fulfill({
            status: 200,
            contentType:
              "application/json",
            body: JSON.stringify({
              reply: `Done! I've added "${bookTitle}" to your cart.`,
              actions: [
                {
                  type: "cart_updated",
                },
              ],
              conversation_id:
                "playwright-demo",
            }),
          });
        }

        //Create real review
        if (ivyRequest === 2) {
          const searchResponse = await page.request.get(`http://localhost:3000/api/books/search?title=${encodeURIComponent(bookTitle)}`);
          
          expect(searchResponse.ok()).toBeTruthy();
          const books = await searchResponse.json();
          const normalizedTitle = bookTitle.trim().toLowerCase();
          const book = books.find((item) => item.title?.trim().toLowerCase() ===normalizedTitle) ?? books[0];
          expect(book).toBeTruthy();

          //Real review request 
          const reviewResponse =
            await page.request.post( "http://localhost:3000/api/reviews",
              {
                headers: {
                  Authorization:
                    authorization,
                },

                data: {
                  bookId: book.id,
                  rating: 5,
                  comment: reviewText,
                },
              }
            );
          expect(reviewResponse.ok()).toBeTruthy();

          //Mock Ivy response
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              reply: `Done! I gave "${bookTitle}" 5 stars and posted your review.`,
              actions: [],
              conversation_id:
                "playwright-demo",
            }),
          });
        }

        return route.fulfill({
          status: 200,
          contentType:"application/json",
          body: JSON.stringify({
            reply: "Done!",
            actions: [],
            conversation_id:
              "playwright-demo",
          }),
        });
      }
    );

    // Homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/Ivory & Ink/i);

    await pause(1000);
    await smoothScrollToPercent(0.20, 900);
    await smoothScrollToPercent(0.40, 900);
    await smoothScrollToPercent(0.60, 900);
    await smoothScrollToPercent(0.80, 900);
    await smoothScrollToPercent(0.96, 1000);
    await smoothScrollTo(0, 1100 );
    await pause(300);


    const searchInput = page.getByPlaceholder("Search by title, author, ISBN...");
    await searchInput.hover();
    await pause(250);
    await searchInput.click();

    await searchInput.pressSequentially(
      searchTitle,
      {
        delay: 35,
      }
    );

    await pause(400);
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/books\/search/);
    await pause(900);

    const bookCard = page
      .getByTestId("book-card")
      .filter({
        has: page.getByRole("img", {
          name: bookTitle,
          exact: true,
        }),
      })
      .first();

    await expect(
      bookCard
    ).toBeVisible({
      timeout: 10000,
    });


    await smoothScrollToElement(bookCard, 700);
    await bookCard.hover();
    await pause(800);

    await bookCard.click();
    await expect(
      page.getByRole("heading", {
        name: bookTitle,
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    await pause(700);

    const addToBagButton = page.getByRole("button", { name: "Add to bag",});
   
    await expect(addToBagButton).toBeVisible();
    await addToBagButton.hover();
    await pause(650);

    await page.mouse.move( 950, 700, { steps: 15,});
    await pause(200);

    // Book details
    await smoothScrollToPercent(0.30, 900);
    await smoothScrollToPercent(0.55, 900);
    await smoothScrollToPercent(0.78, 900);
    await smoothScrollToPercent(0.96, 1000);
    await smoothScrollTo(0, 1000);
    await pause(300);

    await page.goto("/");
    const ivyButton = page.getByRole("button", { name: "Open Ivy assistant",});
    await expect(
      ivyButton
    ).toBeVisible({
      timeout: 10000,
    });

    await ivyButton.hover();
    await pause(500);
    await ivyButton.click();
    const chatInput = page.getByPlaceholder("Ask about a book...");
    await expect(chatInput).toBeVisible();
    await pause(500);

    //Ivy real cart 
    const cartPrompt = `Add "${bookTitle}" to my cart.`;
    await chatInput.click();
    await chatInput.pressSequentially(
      cartPrompt,
      {
        delay: 20,
      }
    );

    await pause(300);
    let sendButton =
      page.getByRole("button", {
        name: "Send",
      });

    await sendButton.hover();
    await pause(250);
    await sendButton.click();

    await expect(
      page.getByText(`Done! I've added "${bookTitle}" to your cart.`,
        {
          exact: true,
        }
      )
    ).toBeVisible({
      timeout: 10000,
    });

    await pause(1100);

    //Ivy real review 
    const reviewPrompt = `Give this book 5 stars and write: "${reviewText}"`;
    await chatInput.click();
    await chatInput.pressSequentially(
      reviewPrompt,
      {
        delay: 16,
      }
    );
    await pause(300);
    sendButton =
      page.getByRole("button", {
        name: "Send",
      });

    await sendButton.hover();
    await pause(250);
    await sendButton.click();

    await expect(
        page.getByText( /I gave .* 5 stars/)
    ).toBeVisible({
      timeout: 10000,
    });

    await pause(1200);

    // show review
    const closeIvyButton =
      page.getByRole("button", {
        name: "Close chat",
      });

    await closeIvyButton.hover();
    await pause(250);
    await closeIvyButton.click();

    //Search for the same book again.
    const reviewSearchInput = page.getByPlaceholder("Search by title, author, ISBN...");
    await reviewSearchInput.hover();
    await pause(200);
    await reviewSearchInput.click();

    await reviewSearchInput.fill(searchTitle);
    await pause(300);
    await reviewSearchInput.press("Enter");
    await expect(page).toHaveURL(/\/books\/search/);


    const reviewedBookCard = page
      .getByTestId("book-card")
      .filter({
        has: page.getByRole("img", {
          name: bookTitle,
          exact: true,
        }),
      })
      .first();

    await expect(
      reviewedBookCard
    ).toBeVisible({
      timeout: 10000,
    });

    await smoothScrollToElement(reviewedBookCard, 600);
    await reviewedBookCard.hover();
    await pause(450);
    await reviewedBookCard.click();

    await expect(
      page.getByRole("heading", {
        name: bookTitle,
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    // Find real review created by Ivy.
    const createdReview = page
      .getByText(reviewText, {
        exact: true,
      })
      .last();

    await expect(
      createdReview
    ).toBeVisible({
      timeout: 10000,
    });


    await smoothScrollToElement(createdReview, 1200);
    const reviewBox = await createdReview.boundingBox();

    if (reviewBox) {
      await page.mouse.move(
        reviewBox.x +
          reviewBox.width / 2,
        reviewBox.y +
          reviewBox.height / 2,
        {
          steps: 20,
        }
      );
    }

    await pause(1400);

    // Show real cart
    const cartLink =
      page.getByRole("link", {
        name: "View cart",
      });

    await cartLink.hover();
    await pause(350);
    await cartLink.click();

    await expect(
      page.getByRole("heading", {
        name: "Shopping Cart",
      })
    ).toBeVisible();

    const cartBook =
      page.getByRole("heading", {
        name: bookTitle,
        exact: true,
      });

    await expect(
      cartBook
    ).toBeVisible();

    const cartBookBox = await cartBook.boundingBox();
    if (cartBookBox) {
      await page.mouse.move(
        cartBookBox.x +
          cartBookBox.width / 2,
        cartBookBox.y +
          cartBookBox.height / 2,
        {
          steps: 20,
        }
      );
    }

    // cart -> checkout

    await pause(700);

    await page.evaluate(() => {
      localStorage.removeItem(
        "guestCheckoutConfirmed"
      );
    });

    const checkoutButton =
      page.getByRole("button", {
        name: "Go to Checkout",
      });

    await expect(checkoutButton).toBeVisible();
    await checkoutButton.hover();
    await pause(300);
    await checkoutButton.click();

    // Continue as guest
    const continueAsGuestButton =
      page.getByRole("button", {
        name: "Continue as Guest",
      });

    await expect(
      continueAsGuestButton
    ).toBeVisible({
      timeout: 5000,
    });

    await pause(700);
    await continueAsGuestButton.hover();
    await pause(300);
    await continueAsGuestButton.click();

    //  AuthSidePanel now sets: guestCheckoutConfirmed = "true" and Cart navigates to /checkout.
    await expect(page).toHaveURL( /\/checkout/,{timeout: 10000,});
    await expect(
      page.getByRole("heading", {
        name: "Complete your order",
      })
    ).toBeVisible({
      timeout: 10000,
    });

    await pause(700);

    // Personal info

    const fullNameInput = page.getByLabel("Full name");
    const emailInput = page.getByLabel("Email address");
    const streetInput = page.getByLabel("Street address");
    const cityInput = page.getByLabel("City");
    const countyInput = page.getByLabel("County");
    const countryInput = page.getByLabel("Country");

    await fullNameInput.click();
    await fullNameInput.fill("Alex Johnson");
    await pause(180);
    await emailInput.fill("alex.johnson@example.com");
    await pause(180);
    await streetInput.fill("25 Library Street");
    await pause(180);
    await cityInput.fill("London");
    await pause(180);
    await countyInput.fill("Greater London");
    await pause(180);
    await countryInput.fill("United Kingdom");
    await pause(500);


    // continue -> shipping
    let continueButton =
      page.getByRole("button", {
        name: "Continue",
      });

    await continueButton.hover();
    await pause(250);
    await continueButton.click();

    await expect(
      page.getByText("Shipping Method",
        {
          exact: true,
        }
      )
    ).toBeVisible({
      timeout: 5000,
    });

    await pause(500);

    const dpdOption = page.getByText("DPD", { exact: true, });

    await dpdOption.hover();
    await pause(300);
    await dpdOption.click();
    await pause(400);

    const deliveryNote = page.getByPlaceholder("Add delivery instructions or a note for your order...");
    await deliveryNote.click();
    await deliveryNote.fill("Please leave the package at the front desk.");
    await pause(400);

    continueButton =
      page.getByRole("button", {
        name: "Continue",
      });

    await continueButton.hover();
    await pause(250);
    await continueButton.click();
    await expect(
      page.getByText("Payment",
        {
          exact: true,
        }
      )
    ).toBeVisible({
      timeout: 5000,
    });

    await pause(500);

    const cardPayment =
      page.getByText(
        "Credit or Debit Card",
        {
          exact: true,
        }
      );

    await cardPayment.hover();
    await pause(300);
    await cardPayment.click();
    await pause(500);

    const placeOrderButton =
      page.getByRole("button", {
        name: "Place Order",
      });

    await expect(placeOrderButton).toBeVisible();
    await placeOrderButton.hover();
    await pause(400);
    await placeOrderButton.click();

    const orderConfirmed =
      page.getByRole("heading", {
        name: "Your order is confirmed",
      });

    await expect(
      orderConfirmed
    ).toBeVisible({
      timeout: 15000,
    });

    await smoothScrollToElement(orderConfirmed, 700);
    await pause(2500);
  });
});