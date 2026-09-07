from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from agent import agent
from services.review_context import set_token, clear_token

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

        answer = response["messages"][-1].content

        return {
            "response": answer
        }

    finally:
        clear_token()