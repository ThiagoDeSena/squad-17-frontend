import { createContext, useState, useEffect } from "react";
import { getUser } from "../services/userAPI.js"; 
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [remeberMe, setRemeberMe] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("jwtToken");
        if (token) {
            fetchUserData(); 
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const remember = Cookies.get("rememberMe") === "true";
        setRemeberMe(remember);
    }, []);

    useEffect(() => {
        Cookies.set("rememberMe", remeberMe, {expires: 7},);
    }, [remeberMe])

    const fetchUserData = async () => {
        try {
            const userData = await getUser();
            setUser(userData);
            localStorage.setItem("profilePath", userData.imagePath || "/images/profile.png");
            localStorage.setItem("bannerPath", userData.bannerPath || "/images/user-banner.png");
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (token, refreshToken) => {
        Cookies.set("jwtToken", token, {expires: 1, secure: true, sameSite: "strict"});
        Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true, sameSite: "strict" });
        await fetchUserData();
    };

    const logout = () => {
        Cookies.remove("jwtToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("profilePath");
        localStorage.removeItem("bannerPath");
        localStorage.removeItem("hasSeenWelcome");
        setUser(null);
    };

    
    return (
        <UserContext.Provider value={{ user, login, logout, loading, remeberMe, setRemeberMe}}>
            {children}
        </UserContext.Provider>
    );
};
