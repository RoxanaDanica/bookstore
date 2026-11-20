
import os

from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq

GROQ_MODELS = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
]

def get_chat_models():
    provider = os.getenv("AI_PROVIDER", "ollama").lower()

    if provider == "ollama":
        return [
            ChatOllama(
                model=os.getenv("OLLAMA_MODEL", "qwen2.5"),
                base_url=os.getenv(
                    "OLLAMA_BASE_URL",
                    "http://localhost:11434",
                ),
                temperature=0.2,
            )
        ]

    if provider == "groq":
        if not os.getenv("GROQ_API_KEY"):
            raise ValueError("GROQ_API_KEY is missing")

        if not GROQ_MODELS:
            raise ValueError("No Groq models configured")

        return [
            ChatGroq(
                model=model_name,
                temperature=0.2,
                max_retries=0,
                timeout=45,
            )
            for model_name in GROQ_MODELS
        ]

    raise ValueError(
        f"Unsupported AI provider: {provider}"
    )
