import axios from "axios";
import { handleTokenRefresh } from "./handleTokenRefresh";

const commentApi = axios.create({
  baseURL: "http://localhost:8081/comments",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

commentApi.interceptors.request.use(
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

commentApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return commentApi.request(error.config);
        }
      } catch (refreshError) {
        console.error("🚨 Erro ao renovar o token após 401:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const getCommentsByReviewId = async (reviewId) => {
    try {
        const response = await commentApi.get(`/review/${reviewId}`);
        return response.data.content;
    } catch (error) {
        console.error("Erro ao buscar comentarios:", error);
        throw error;
    }
}
export const getCommentsById = async (reviewId) => {
  try {
      const response = await commentApi.get(`/${reviewId}`);
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar comentarios:", error);
      throw error;
  }
}

export const postComment = async (reviewId, content) => {
  try {
    const response = await commentApi.post(`/review/${reviewId}`, {
      content: content,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao postar comentário", error);
    throw error;
  }
}

export const deleteComment = async (id) => {
  try {
    const response = await commentApi.delete(`/${id}`);
    return response.status;
  } catch (error) {
    console.error("Erro ao deletar comentario!", error);
    throw error;
  }
}

export const editComment = async (id, content) => {
  try {
    const response = await commentApi.put(`/${id}`, {
      content: content
    })
    return response.data
  } catch (error) {
    console.error("Erro ao editar comentario!", error);
    throw error;
  }

}