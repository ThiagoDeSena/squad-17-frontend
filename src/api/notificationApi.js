import axios from "axios";
import { handleTokenRefresh } from "./handleTokenRefresh";

const notificationApi = axios.create({
  baseURL: "http://localhost:8081/user/notifications",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

notificationApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await handleTokenRefresh();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Erro ao atualizar o token na requisição:", error);
      throw error;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

notificationApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return notificationApi.request(error.config);
        }
      } catch (refreshError) {
        console.error("🚨 Erro ao renovar o token após 401:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const getNotifications = async () => {
    try {
        const response = await notificationApi.get();
        return response.data.content;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const readNotification = async (notificationId) => {
    try {
        const response = await notificationApi.put(`/${notificationId}/seen`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const  deleteNotification = async (notificationId) => {
    try {
        const response = await notificationApi.delete(`/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteAllNotification = async () => {
  try {
    const response = await notificationApi.delete("/all");  
    return response.data;  
  } catch (error) {
    console.error(error);
    throw error;
  }
}