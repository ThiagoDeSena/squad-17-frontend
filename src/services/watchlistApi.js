import axios from "axios";
import { handleTokenRefresh } from "./handleTokenRefresh";

const watchlistApi = axios.create({
  baseURL: "http://localhost:8081/watchlist",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

watchlistApi.interceptors.request.use(
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

watchlistApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return reviewApi.request(error.config);
        }
      } catch (refreshError) {
        console.error("🚨 Erro ao renovar o token após 401:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getWatchList = async (status, page = 0, size = 10) => {
  try {
    const response = await watchlistApi.get(`/${status}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar Watchlist (${status}):`, error);
    throw error;
  }
};

export const addToWatchList = async (mediaId, mediaType) => {
  try {
    const response = await watchlistApi.post("", {
      mediaId: mediaId,
      mediaType: mediaType,
      mediaStatus: "pendente",
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao adicionar ${mediaType} (${mediaId}) na Watchlist:`, error);
    throw error;
  }
};

export const removeToWatchlist = async (mediaId, mediaType) => {
  try {
    const response = await watchlistApi.delete(`/${mediaType}/${mediaId}`);
    return response.status;
  } catch (error) {
    console.error(`Erro ao remover ${mediaType} (${mediaId}) da Watchlist:`, error);
    throw error;
  }
};

export const isToTheWatchList = async (mediaId, mediaType) => {
  try {
    const promise = watchlistApi(`/${mediaType}/${mediaId}`);
    const response = await new Promise((resolve) => setTimeout(() => resolve(promise), 500));
    return response.data;
  } catch (error) {
    console.error(`Erro ao verificar Watchlist para ${mediaType} (${mediaId}):`, error);
    return null;
  }
};

export const categoryMoved = async (id, newStatus) => {
  try {
    const response = await watchlistApi.put(`/${id}`, {
      mediaStatus: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao mover item (${id}) para status ${newStatus}:`, error);
    throw error;
  }
};
