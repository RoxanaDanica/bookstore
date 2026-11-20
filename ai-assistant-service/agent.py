
import logging

from groq import (
    RateLimitError,
    APIConnectionError,
    APITimeoutError,
    InternalServerError,
)
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_model_call

from services.model_provider import get_chat_models
from services.get_book_info import get_book_info
from services.submit_book_review import give_review
from services.check_book_stock import check_stock
from services.add_book_to_cart import add_book_to_cart


logger = logging.getLogger(__name__)

models = get_chat_models()

if not models:
    raise ValueError("No AI models configured")

primary_model = models[0]

RETRYABLE_ERRORS = (
    RateLimitError,
    APIConnectionError,
    APITimeoutError,
    InternalServerError,
)


@wrap_model_call
def model_fallback(request, handler):
    last_error = None

    for index, candidate in enumerate(models):
        try:
            response = handler(
                request.override(model=candidate)
            )

            if index > 0:
                logger.info(
                    "AI fallback succeeded with model %s",
                    getattr(candidate, "model_name", "unknown"),
                )

            return response

        except RETRYABLE_ERRORS as error:
            last_error = error

            logger.warning(
                "AI model %s/%s failed (%s): %s",
                index + 1,
                len(models),
                type(error).__name__,
                getattr(candidate, "model_name", "unknown"),
            )

    if last_error is not None:
        raise last_error

    raise RuntimeError("No AI model could process the request")


agent = create_agent(
    model=primary_model,
    tools=[
        get_book_info,
        give_review,
        check_stock,
        add_book_to_cart,
    ],
    middleware=[model_fallback],
    system_prompt="""
    You are a friendly bookstore assistant.

    Important rules:
    - For stock or availability questions, ALWAYS use the check_stock tool.
    - For book details such as author, genre, price, or description, use get_book_info.
    - For any details about a book, ALWAYS use the get_book_info tool.
    - For review submission, use give_review.
    - If a tool is available for the requested information, use it before answering.
    - When the user asks for information about a specific book, ALWAYS use the get_book_info tool.

    Review rules:
    - If the user forgot to mention the star rating, ask them to provide a rating between 1 and 5 stars.
    - If the user asks you to write or suggest a review, first generate a short natural review based on what the user says.
    - Show the proposed review to the user.
    - Then ask: "Would you like me to post this review?"
    - Only call give_review after the user explicitly confirms that they want to post or submit it.
    - If the user says "yes", "post it", "submit it", or clearly confirms, use the most recently discussed book and the most recently proposed review.
    - Only call give_review after the user explicitly confirms their intent.

    Add book to cart rules:
    - Only add a book to the cart when the user clearly asks to add it.
    - Before calling add_book_to_cart, make sure you know the correct book ID.
    - If the user gives only a title, use get_book_info first to identify the book and obtain its ID.
    - Use quantity 1 unless the user explicitly requests another quantity.
    - After successfully adding a book, tell the user that it was added to their cart.
    - Use only real book IDs from the bookstore database when calling add_book_to_cart.
    - If you fail to find a book ID, inform the user that you cannot add it to the cart.

    Use previous conversation context.
    If the user asks a follow-up question like "price", "stock", or "reviews",
    use the most recently mentioned book unless specified otherwise.
    """,
)
