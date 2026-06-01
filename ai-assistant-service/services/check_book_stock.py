import requests
from langchain_core.tools import tool
from services.config import BACKEND_URL


@tool
def check_stock(title: str) -> str:
    """Check if a book is in stock by title."""

    try:
        response = requests.get(
            f"{BACKEND_URL}/books",
            timeout=5
        )

        response.raise_for_status()

        data = response.json()

        if not isinstance(data, list):
            return "Invalid backend response format."

        title_lower = title.lower()

        book = next(
            (
                b for b in data
                if title_lower in b.get("title", "").lower()
            ),
            None
        )

        if not book:
            return f"No book found matching '{title}'."

        stock = book.get("stock")

        if stock is None:
            return f"Stock information is not available for '{book.get('title')}'."

        if stock > 0:
            return f"'{book.get('title')}' is in stock ({stock} available)."
        else:
            return f"'{book.get('title')}' is currently out of stock."

    except requests.Timeout:
        return "Database request timed out."

    except requests.RequestException as e:
        return f"Error accessing database: {str(e)}"