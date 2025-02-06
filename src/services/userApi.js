import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./authAPI";

const logout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("profilePath");
    localStorage.removeItem("bannerPath");
};

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return true;
    }
};

const userApi = axios.create({
    baseURL: "http://localhost:8081/user",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
});

userApi.interceptors.request.use(
    async (config) => {
        let token = Cookies.get("jwtToken");
        let refreshTokenValue = Cookies.get("refreshToken");
        let remeberMe = Cookies.get("rememberMe");

        console.log(remeberMe)
        console.log(refreshTokenValue)
        if (!token || isTokenExpired(token)) {
            if (remeberMe === 'true' && refreshTokenValue && !isTokenExpired(refreshTokenValue)) {
                try {
                    console.log("🔄 Tentando renovar o token...");
                    const newToken = await refreshToken(refreshTokenValue)
                    console.log(newToken)
                    if (newToken) {
                        console.log("✅ Token renovado com sucesso!");
                        Cookies.set('jwtToken', newToken);
                        config.headers.Authorization = `Bearer ${newToken}`;
                        return config;
                    }
                } catch (error) {
                    console.error("🚨 Erro ao renovar o token:", refreshError);
                }
            }
            console.warn("⚠ Token expirado. Redirecionando para login...");
            logout();
            window.location.href = "/";
            throw new Error("Token expirado. Faça login novamente.");
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            let refreshTokenValue = Cookies.get("refreshToken");
            let remeberMe = Cookies.get("rememberMe");
            
            console.log(remeberMe)
            console.log(refreshTokenValue)
            if (remeberMe === "true" && refreshTokenValue && !isTokenExpired(refreshTokenValue)) {
                try {
                    const newToken = await refreshToken(refreshTokenValue);
                    if (newToken) {
                        console.log("✅ Token renovado com sucesso!");
                        Cookies.set("jwtToken", newToken);
                        error.config.headers.Authorization = `Bearer ${newToken}`;
                        return userApi.request(error.config);
                    }
                } catch (refreshError) {
                    console.error("🚨 Erro ao renovar o token após 401:", refreshError);
                }
            }
            console.warn("⚠ Sessão expirada. Redirecionando para login...");
            logout();
            window.location.href = "/";
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
}

export const putImageProfile = async (image) => {
    try {
        const response = await userApi.put("/profile-image", { image: image });
        return response;
    } catch (error) {
        console.error("Erro ao atualizar a imagem de perfil:", error);
        throw error;
    }
}

export const putBannerProfile = async (banner) => {
    try {
        const response = await userApi.put("/profile-banner", { banner: banner });
        return response;
    } catch (error) {
        console.error("Erro ao atualizar o banner de perfil:", error);
        throw error;
    }
}



