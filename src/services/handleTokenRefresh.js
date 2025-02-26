import Cookies from "js-cookie";
import { refreshToken } from "./authAPI";

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return true;
    }
};

export const logout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("profilePath");
    localStorage.removeItem("bannerPath");
    window.location.href = "/";
};

export const handleTokenRefresh = async () => {
    let token = Cookies.get("jwtToken");
    let refreshTokenValue = Cookies.get("refreshToken");
    let rememberMe = Cookies.get("rememberMe");

    if (!token || isTokenExpired(token)) {
        if (rememberMe === "true" && refreshTokenValue && !isTokenExpired(refreshTokenValue)) {
            try {
                console.log("🔄 Tentando renovar o token...");
                const newToken = await refreshToken(refreshTokenValue);
                if (newToken) {
                    console.log("✅ Token renovado com sucesso!");
                    Cookies.set("jwtToken", newToken);
                    return newToken;
                }
            } catch (error) {
                console.error("🚨 Erro ao renovar o token:", error);
            }
        }
        console.warn("⚠ Token expirado. Redirecionando para login...");
        logout();
        throw new Error("Token expirado. Faça login novamente.");
    }

    return token;
};
