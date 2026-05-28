import requests
from langchain_core.tools import tool
from services.config import BACKEND_URL


@tool
def get_book_info(title: str) -> str:
    """Get information about a book from the store database"""
    res = requests.get(f"{BACKEND_URL}/books")

    if res.status_code != 200:
        return "Error accessing database."

    books = res.json()
    if not isinstance(books, list):
        return "Invalid backend response."

    book = next(
        (b for b in books if title.lower() in b["title"].lower()),
        None
    )

    if not book:
        return (
            f"Book '{title}' is not available in our store. "
            f"It is currently out of stock and we do not have a restock date yet."
        )

    return (
        f"Title: {book['title']}\n"
        f"Author: {book['author']}\n"
        f"Price: {book['price']}\n"
    )

