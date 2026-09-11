import json
import requests

from langchain_core.tools import tool
from services.auth_context import get_token


@tool
def add_book_to_cart(
    book_id: int,
    quantity: int = 1
) -> str:
    """
    Add a book to the current user's shopping cart.
    """

    if quantity < 1:
        return json.dumps({
            "success": False,
            "message": "Quantity must be at least 1."
        })

    token = get_token()

    if not token:
        return json.dumps({
            "success": False,
            "message": "Unable to identify the current user."
        })

    try:
        response = requests.post(
            "http://localhost:3000/api/cart/items",
            json={
                "bookId": book_id,
                "quantity": quantity,
            },
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=10,
        )

        data = response.json()

        if response.status_code >= 400:
            return json.dumps({
                "success": False,
                "message": data.get(
                    "error",
                    "Unable to add the book to the cart."
                )
            })

        return json.dumps({
            "success": True,
            "action": "cart_updated",
            "message": (
                f"Book added to cart successfully. "
                f"Quantity added: {quantity}."
            )
        })

    except requests.RequestException as error:
        return json.dumps({
            "success": False,
            "message": (
                "Unable to connect to the bookstore service: "
                f"{error}"
            )
        })