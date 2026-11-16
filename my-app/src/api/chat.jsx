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

export const wakeUpIvy = async () => {
  const response = await getAxiosInstance().get("/chat/health", {
    timeout: 90000,
  });

  return response.data;
};