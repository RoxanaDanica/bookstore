import { randomUUID } from "crypto";
import { createConversation } from "../persistance/conversations.js";
import {
  createMessage,
  getMessagesByConversation,
  findConversation,
  getConversationMessages
} from "../persistance/messages.js";

export const chat = async (
  userId,
  conversationId,
  message,
  token
) => {
  if (!userId) {
    throw new Error("Missing user_id");
  }

  if (!conversationId) {
    throw new Error("Missing conversation_id");
  }

  const conversation = await findConversation(
    userId,
    conversationId
  );

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await createMessage(
    conversationId,
    "user",
    message
  );

  const history = await getMessagesByConversation(
    conversationId
  );

  const messages = history.map((item) => ({
    role: item.role,
    content: item.content
  }));

  const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || "http://localhost:8000";

  const response = await fetch(
    `${AI_SERVICE_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        token
      })
    }
  );

  const responseText = await response.text();

  console.log("IVY STATUS:", response.status);
  console.log("IVY CONTENT TYPE:", response.headers.get("content-type"));
  console.log("IVY RESPONSE:", responseText.slice(0, 500));

  if (!response.ok) {
    throw new Error(`Ivy returned HTTP ${response.status}`);
  }

  const data = JSON.parse(responseText);

  const answer =
    data.response ??
    "AI did not return a response";

  const actions =
    Array.isArray(data.actions)
      ? data.actions
      : [];

  await createMessage(
    conversationId,
    "assistant",
    answer
  );

  return {
    reply: answer,
    actions,
    conversation_id: conversationId
  };
};

export const getConversation = async ( userId, conversationId ) => {

  if (!userId) {
    throw new Error("Missing user_id");
  }

  const conversation = await findConversation(
    userId,
    conversationId
  );

  if (!conversation) {
    return {
      conversation_id: null,
      messages: []
    };
  }

  const messages = await getConversationMessages(
    conversation.id
  );

  return {
    conversation_id: conversation.id,
    messages
  };
};

export const startConversation = async (userId ) => {
  if (!userId) {
    throw new Error("Missing user_id");
  }

  const conversation =
    await createConversation(userId);

  return {
    conversation_id: conversation.id
  };
};