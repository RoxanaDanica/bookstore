from langchain_ollama import ChatOllama
from langchain.agents import create_agent

from services.get_book_info import get_book_info
from services.submit_book_review import give_review


model = ChatOllama(model="qwen2.5")

agent = create_agent(
    model=model,
    tools=[
        get_book_info,
        give_review,
    ],
    system_prompt=(
        "You are a bookstore assistant. "
        "Use tools to check database before answering. "
    )
)