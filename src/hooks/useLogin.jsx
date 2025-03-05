import { useState, useContext, useEffect } from "react";
import { UserContext } from "../Contexts/UserContext";
import { loginUser } from "../api/authAPI";

const useLogin = () => {
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
                const { token, refreshToken } = response;
                setAlert({
                    show: true,
                    message: response.message,
                    type: "success",
                });
                setTimeout(() => login(token, refreshToken), 2500);
        } catch (error) {
            setAlert({
                show: true,
                message: error.response.data.message,
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({ show: false, message: "", type: "" });
            }, 3000);
        }
    }, [alert.show]);
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
        setRemeberMe,
        handleRememberMeChange
    };
};
export default useLogin