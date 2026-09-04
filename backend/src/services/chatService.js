import { randomUUID } from "crypto";
import { createConversation } from "../persistance/conversations.js";
import {
  createMessage,
  getMessagesByConversation,
  findConversation,
  getConversationMessages
} from "../persistance/messages.js";

export const chat = async ( userId, conversationId, message ) => {
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
    conversationId,
    "assistant",
    answer
  );

  return {
    reply: answer,
    conversation_id: conversationId
  };
};

export const getConversation = async ( userId, conversationId ) => {
  console.log("GET CONVERSATION id", conversationId);
  if (!userId) {
    throw new Error("Missing user_id");
  }

  const conversation = await findConversation(
    userId,
    conversationId
  );

  console.log("FOUND CONVERSATION:", conversation);

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

export const startConversation = async (userId) => {
  if (!userId) {
    throw new Error("Missing user_id");
  }

  const conversation = await createConversation(userId);

  return {
    conversation_id: conversation.id
  };
};