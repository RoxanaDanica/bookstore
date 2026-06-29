import { getAxiosInstance } from "./axios";

export const sendChatMessage = (payload) => {
  return getAxiosInstance().post("/api/chat", payload);
};

export const startConversation = (payload) => {
  return getAxiosInstance().post("/api/chat/start", payload);
};
