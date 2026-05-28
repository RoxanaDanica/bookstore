from fastapi import FastAPI
from pydantic import BaseModel
from agent import agent

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

def chat(message: str):
    response = agent.invoke({
        "messages": [
            {"role": "user", "content": message}
        ]
    })

    return response["messages"][-1].content

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    reply = chat(req.message)
    return {"response": reply}