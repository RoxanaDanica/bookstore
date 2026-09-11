import json

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from langchain_core.messages import ToolMessage

from agent import agent
from services.auth_context import set_token, clear_token


app = FastAPI()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    token: str


@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    messages = [
        {
            "role": message.role,
            "content": message.content
        }
        for message in req.messages
    ]

    set_token(req.token)

    try:
        response = agent.invoke({
            "messages": messages
        })

        response_messages = response["messages"]

        answer = response_messages[-1].content

        actions = []

        for message in response_messages:
            if not isinstance(message, ToolMessage):
                continue

            if message.name != "add_book_to_cart":
                continue

            try:
                tool_result = json.loads(
                    message.content
                )
            except (json.JSONDecodeError, TypeError):
                continue

            if (
                tool_result.get("success") is True
                and tool_result.get("action")
                == "cart_updated"
            ):
                actions.append({
                    "type": "cart_updated"
                })

        return {
            "response": answer,
            "actions": actions
        }

    finally:
        clear_token()