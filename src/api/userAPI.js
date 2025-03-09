import axios from "axios";
import { handleTokenRefresh } from "./handleTokenRefresh";

const userApi = axios.create({
  baseURL: "http://localhost:8081/user",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

userApi.interceptors.request.use(
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
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return userApi.request(error.config);
        }
      } catch (refreshError) {
        console.error("🚨 Erro ao renovar o token após 401:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getUser = async () => {
  try {
    const response = await userApi.get();
    return response.data;
  } catch (error) {
    console.error("Erro ao busca dados do usuario:", error);
    throw error;
  }
};


export const getTopUsers =  async () => {
  try {
    const response = await userApi.get("top-tier");
    return response.data;
  } catch (error) {
    console.error(error + "Erro ao carregar os melhores usuarios!");
    throw error;
  }
}
export const putImageProfile = async (image) => {
  try {
    const response = await userApi.put("/profile-image", { image: image });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar a imagem de perfil:", error);
    throw error;
  }
};

export const putBannerProfile = async (banner) => {
  try {
    const response = await userApi.put("/profile-banner", { banner: banner });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar o banner de perfil:", error);
    throw error;
  }
};

export const getUsersInfo = async (id) => {
  try {
    const response = await userApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao busca dados do usuario:", error);
    throw error;
  }
};

export const updateUser = async (update) => {
  try {
    const response = await userApi.put("/profile", update);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (pass) => {
  try {
    const response = await userApi.delete("", { data: { password: pass } });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
