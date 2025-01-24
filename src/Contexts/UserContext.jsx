import { createContext, useState, useEffect } from "react";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("jwtToken", token);
        setUser({ token });
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
