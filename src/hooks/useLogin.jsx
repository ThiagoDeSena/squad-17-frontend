import { useState, useContext } from "react";
import { UserContext } from "../Contexts/UserContext";
import { loginUser } from "../services/authAPI";

export const useLogin = () => {
    const { login, setRemeberMe, remeberMe } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const validateFields = () => {
        if (!email || !password) {
            setAlert({
                show: true,
                type: "error",
                message: "Por favor, preencha todos os campos!",
            });
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setAlert({
                show: true,
                type: "error",
                message: "Por favor, insira um e-mail válido!",
            });
            return false;
        }

        return true;
    };

    const handleRememberMeChange = (e) => {
        setRemeberMe(e.target.checked);
    };

    // Lógica de login
    const handleLogin = async () => {
        if (!validateFields()) return;

        setIsLoading(true);
        try {
            const response = await loginUser(email, password);

            if (response.error) {
                setAlert({
                    show: true,
                    message: response.message,
                    type: "error",
                });
            } else {
                const { token, refreshToken } = response;
                setAlert({
                    show: true,
                    message: response.message,
                    type: "success",
                });
                setTimeout(() => login(token, refreshToken), 2500);
            }
        } catch (error) {
            setAlert({
                show: true,
                message: "Ocorreu um erro inesperado. Tente novamente.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

   
    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        alert,
        setAlert,
        isLoading,
        setIsLoading,
        handleLogin,
        remeberMe,
        handleRememberMeChange
    };
};
