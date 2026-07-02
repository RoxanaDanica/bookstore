import { getAxiosInstance } from "./axios";

export const createGuest = async () => {
  const res = await getAxiosInstance().post("/auth/guest");
  return res.data;
}; 

export const register = async (data) => {
  const res = await getAxiosInstance().post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await getAxiosInstance().post("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await getAxiosInstance().get("/auth/me");
  return res.data;
};