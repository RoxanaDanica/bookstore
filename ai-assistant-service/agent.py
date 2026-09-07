from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from services.get_book_info import get_book_info
from services.submit_book_review import give_review
from services.check_book_stock import check_stock

model = ChatOllama(model="qwen2.5")


agent = create_agent(
    model=model,
    tools=[
        get_book_info,
        give_review,
        check_stock,
    ],
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

    Use previous conversation context.
    If the user asks a follow-up question like "price", "stock", or "reviews",
    use the most recently mentioned book unless specified otherwise.
    """

)
