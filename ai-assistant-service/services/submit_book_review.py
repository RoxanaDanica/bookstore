from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langchain_core.tools import tool
import requests
from services.config import BACKEND_URL

@tool
def give_review(title: str, review: str) -> str:
    """Submit a review for a book"""

    books = requests.get(f"{BACKEND_URL}/api/books").json()

    book = next(
        (b for b in books if title.lower() in b["title"].lower()),
        None
    )

    if not book:
        return "Book not found."

    res = requests.post(
        f"{BACKEND_URL}/reviews",
        json={
            "book_id": book["id"],
            "review": review
        }
    )

    if res.status_code == 200:
        return "Thank you for your feedback!"

    return "Failed to submit review."