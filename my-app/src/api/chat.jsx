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
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await getAxiosInstance().get("/chat/health", {
        timeout: 90000,
      });

      if (response.data?.status === "ok") {
        return response.data;
      }

      throw new Error("Ivy is not ready yet");
    } catch (error) {
      console.warn(
        `Ivy wake-up attempt ${attempt}/${maxAttempts} failed`,
        error
      );

      if (attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );
    }
  }
};