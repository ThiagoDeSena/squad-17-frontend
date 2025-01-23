import axios from "axios";

const userApi = axios.create({
    baseURL: "http://localhost:8081/user",
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        "Content-Type": "application/json;charset=utf-8",
    },
});


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