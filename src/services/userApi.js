import axios from "axios";

let token = localStorage.getItem("jwtToken");
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
        token = localStorage.getItem("jwtToken"); 
        if (token) {
            if (isTokenExpired(token)) {
                localStorage.removeItem("jwtToken");
                window.location.href = "/";
                throw new Error("Token expirado. Faça login novamente.");
            }
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


userApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("jwtToken");
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);


export const getUser = async () => {
    try {
        const response = await userApi.get();
        return response.data;
    }catch(error){
        console.error("Erro ao busca dados do usuario:", error);
        throw error;
    }
}

export const putImageProfile = async (image) => {
    try {
        const response = await userApi.put("/profile-image", {image: image});
        return response;
    }catch(error){
        console.error("Erro ao atualizar a imagem de perfil:", error);
        throw error;
    }
}

export const putBannerProfile = async (banner) => {
    try {
        const response = await userApi.put("/profile-banner", {banner: banner});
        return response;
    }catch(error){
        console.error("Erro ao atualizar o banner de perfil:", error);
        throw error;
    }
}