import axios from "axios";
import { handleTokenRefresh } from "./handleTokenRefresh";

const followApi = axios.create({
  baseURL: "http://localhost:8081/follow",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

followApi.interceptors.request.use(
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

followApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return followApi.request(error.config);
        }
      } catch (refreshError) {
        console.error("🚨 Erro ao renovar o token após 401:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getIsFollowing = async (userId) => {
  try {
    const response = await followApi.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    const response = await followApi.post(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await followApi.delete(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFollowers = async (userId, type) => {
  try {
    const response = await followApi.get(`/${userId}/${type}`);
    return response.data.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
