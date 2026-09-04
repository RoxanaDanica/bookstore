import { getAxiosInstance } from "./axios";

export const sendChatMessage = (payload) => {
  return getAxiosInstance().post("/chat", payload);
};

export const startConversation = () => {
  return getAxiosInstance().post("/chat/start");
};

export const getConversation = () => {
  return getAxiosInstance().get("/chat");
};