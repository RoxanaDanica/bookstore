
import logging
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

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

MAX_RETRIES = 1
MAX_RETRY_WAIT = 5


def get_retry_delay(error):
    """Get the retry delay from the provider response."""
    response = getattr(error, "response", None)

    if response is not None:
        retry_after = response.headers.get("retry-after")

        if retry_after:
            try:
                return max(0, float(retry_after))
            except ValueError:
                try:
                    retry_date = parsedate_to_datetime(retry_after)

                    if retry_date.tzinfo is None:
                        retry_date = retry_date.replace(
                            tzinfo=timezone.utc
                        )

                    return max(
                        0,
                        (
                            retry_date - datetime.now(timezone.utc)
                        ).total_seconds(),
                    )
                except (TypeError, ValueError, OverflowError):
                    pass

    return 2


@wrap_model_call
def model_fallback(request, handler):
    last_error = None

    for index, candidate in enumerate(models):
        model_name = getattr(
            candidate,
            "model_name",
            "unknown",
        )

        for attempt in range(MAX_RETRIES + 1):
            try:
                response = handler(
                    request.override(model=candidate)
                )

                if index > 0:
                    logger.info(
                        "AI fallback succeeded with model %s",
                        model_name,
                    )

                return response

            except RateLimitError as error:
                last_error = error

                logger.warning(
                    "AI model %s/%s rate limited: "
                    "%s (attempt %s/%s)",
                    index + 1,
                    len(models),
                    model_name,
                    attempt + 1,
                    MAX_RETRIES + 1,
                )

                if attempt >= MAX_RETRIES:
                    break

                delay = get_retry_delay(error)

                if delay > MAX_RETRY_WAIT:
                    logger.info(
                        "Retry delay %.2fs exceeds limit "
                        "for model %s; trying next model",
                        delay,
                        model_name,
                    )
                    break

                logger.info(
                    "Retrying model %s in %.2fs",
                    model_name,
                    delay,
                )

                time.sleep(delay)

            except (
                APIConnectionError,
                APITimeoutError,
                InternalServerError,
            ) as error:
                last_error = error

                logger.warning(
                    "AI model %s/%s failed (%s): %s",
                    index + 1,
                    len(models),
                    type(error).__name__,
                    model_name,
                )

                break

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
