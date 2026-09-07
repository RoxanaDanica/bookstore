import requests
from langchain_core.tools import tool
from services.config import BACKEND_URL

@tool
def get_book_info(title: str) -> str:
    """
    Search for a book and return its details.
    Use this whenever the user asks about a book.
    """

    books_response = requests.get(
        f"{BACKEND_URL}/api/books/search",
        params={
            "title": title
        },
        timeout=5
    )

    books_response.raise_for_status()
    books = books_response.json()

    book = next(
        (
            b for b in books
            if title.strip().lower()
            == b.get("title", "").strip().lower()
        ),
        None
    )

    if not book:
        return f"I could not find a book called {title}."

    return f"""
    BOOK FOUND:

    Title: {book.get('title')}
    Author: {book.get('authors')}
    Genre: {book.get('categories')}
    Price: {book.get('price')}
    Stock: {book.get('stock', 'unknown')}
    Description: {book.get('description')}
    """