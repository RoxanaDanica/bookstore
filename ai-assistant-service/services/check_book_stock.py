import requests
from langchain_core.tools import tool
from services.config import BACKEND_URL


@tool
def check_stock(title: str) -> str:
    'Check if a book is in stock'

    response = requests.get(f"{BACKEND_URL}/books")
    if response.status_code != 200:
        return "Error accessing database."
    data = response.json()

    if not isinstance(data, list):
        return "Invalid backend response"

    book = next(
        (b for b in data if b["title"].lower() == title.lower()),
        None
    )

    if not book:
        return f"'{title}' is not in stock."

    stock = book.get("stock", 0)

    if stock > 0:
        return f"'{title}' is in stock ({stock} available)."
    else:
        return f"'{title}' is out of stock."

