import { randomUUID } from "crypto";
import { createConversation } from "../persistance/conversations.js";
import {
  createMessage,
  getMessagesByConversation
} from "../persistance/messages.js";

export const chat = async (user_id, conversation_id, message) => {
  if (!user_id) {
    user_id = randomUUID();
  }

  if (!conversation_id) {
    conversation_id = randomUUID();
    await createConversation(
      conversation_id,
      user_id
    );
  }
  await createMessage(
    conversation_id,
    "user",
    message
  );
  const history = await getMessagesByConversation(
    conversation_id
  );
  const messages = history.map((item) => ({
    role: item.role,
    content: item.content
  }));

  console.log("SENDING TO AI:", messages);

  const response = await fetch(
    "http://host.docker.internal:8000/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages
      })
    }
  );

  const data = await response.json();
  const answer = data.response ?? "AI did not return a response";
  await createMessage(
    conversation_id,
    "assistant",
    answer
  );

  return {
    reply: answer,
    conversation_id,
    user_id
  };
};