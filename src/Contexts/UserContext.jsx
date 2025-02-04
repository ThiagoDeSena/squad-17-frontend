import { createContext, useState, useEffect } from "react";
import { getUser } from "../services/userAPI"; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            fetchUserData(); 
        } else {
            setLoading(false);
        }
    }, []);

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

    const login = async (token) => {
        localStorage.setItem("jwtToken", token);
        await fetchUserData();
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("profilePath");
        localStorage.removeItem("bannerPath");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
