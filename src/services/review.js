import axios from "axios";
import { handleTokenRefresh } from "./handleTokenRefresh";

const reviewApi = axios.create({
  baseURL: "http://localhost:8081/reviews",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

reviewApi.interceptors.request.use(
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

reviewApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
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

export const getReviews = async () => {
  try {
    const response = await reviewApi.get();
    return response.data.content;
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);
  }
};

export const getReviewsById = async (id) => {
  try {
    const response = await reviewApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar review!", error);
    throw error;
  }
};

export const getReviewsByUserId = async (id, query = "") => {
  try {
    const response = await reviewApi.get(`/user/${id}${query}`);
    return response.data.content;
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);
  }
};

export const getReviewByMedia = async (mediaId, mediaType) => {
  try {
    const response = await reviewApi.get(`/media/${mediaType}/${mediaId}`);
    return response.data.content;
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);
  }
};

export const createReview = async (review) => {
  try {
    const response = await reviewApi.post("", {
      content: review.content,
      mediaId: review.mediaId,
      mediaType: review.mediaType,
      nota: review.nota,
      containsSpoiler: review.containsSpoiler,
    });
    return response;
  } catch (error) {
    console.error("Erro ao postar nova review!", error);
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await reviewApi.delete(`/${id}`);
    return response.status;
  } catch (error) {
    console.error("Erro ao deletar review!", error);
    throw error;
  }
};

export const updateReview = async (id, update) => {
  try {
    const response = await reviewApi.patch(`/${id}`, {
      content: update.content,
      nota: update.nota,
      containsSpoiler: update.containsSpoiler,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar review!", error);
    throw error;
  }
};


export const interationReview = async (id, interaction) => {
  try {
    const response = await reviewApi.put(`${id}/${interaction}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao interagir com review!", error);
    throw error;
  }
}

export const verifyInteraction = async (id, interaction) => {
  try {
    const response = await reviewApi.get(`${id}/${interaction}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar review!", error);
    throw error;
  }
}

