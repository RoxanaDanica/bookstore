from langchain_core.tools import tool
import requests
from services.config import BACKEND_URL
from services.review_context import get_token

@tool
def give_review(
    title: str,
    rating: int,
    comment: str,
) -> str:
    """
    Submit a review for a book.
    Only use this tool after the user explicitly confirms
    that they want to post the review.
    """

    token = get_token()
    if not token:
        return "Authentication token is missing."

    if rating < 1 or rating > 5:
        return "Rating must be between 1 and 5."
    try:
        books_response = requests.get(
            f"{BACKEND_URL}/api/books/search",
            params={
                "title": title
            },
            timeout=5
        )

        books_response.raise_for_status()
        books = books_response.json()

        if not books:
            return f"I could not find a book called '{title}'."

        normalized_title = title.strip().lower()

        book = next(
            (
                b for b in books
                if b.get("title", "").strip().lower()
                == normalized_title
            ),
            None
        )

        if not book:
            book = books[0]

        response = requests.post(
            f"{BACKEND_URL}/api/reviews",
            headers={
                "Authorization": f"Bearer {token}"
            },
            json={
                "bookId": book["id"],
                "rating": rating,
                "comment": comment
            },
            timeout=5
        )
        response.raise_for_status()

        return f"Review submitted successfully for '{book['title']}'."

    except requests.Timeout:
        return "The review submission timed out."

    except requests.RequestException as e:
        return f"Failed to submit the review: {str(e)}"