import requests
from langchain_core.tools import tool
from services.config import BACKEND_URL

@tool
def get_book_info(title: str) -> str:
    """
    Search for a book and return its details.
    Use this whenever the user asks about a book.
    """
    res = requests.get(
        f"{BACKEND_URL}/api/books"
    )

    if res.status_code != 200:
        return "I could not access the books database."

    books = res.json()
    book = next(
        (
            b for b in books
            if title.lower() in b["title"].lower()
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