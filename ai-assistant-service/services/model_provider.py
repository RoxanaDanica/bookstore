import os

from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq


def get_chat_model():
    provider = os.getenv("AI_PROVIDER", "ollama").lower()

    if provider == "ollama":
        return ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "qwen2.5"),
            base_url=os.getenv(
                "OLLAMA_BASE_URL",
                "http://localhost:11434"
            ),
            temperature=0,
        )

    if provider == "groq":
        if not os.getenv("GROQ_API_KEY"):
            raise ValueError(
                "GROQ_API_KEY is missing"
            )

        return ChatGroq(
            model=os.getenv(
                "GROQ_MODEL",
                "llama-3.3-70b-versatile"
            ),
            temperature=0,
        )

    raise ValueError(
        f"Unsupported AI provider: {provider}"
    )
