import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authAPI"; // Ajuste o caminho conforme necessário
import { useLogin } from "./useLogin";

export const useCadastro = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [showCriteries, setsShowCriteries] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email é obrigatório.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email inválido.";
        }

        if (!formData.password) {
            newErrors.password = "Senha é obrigatória.";
        } else {
            const passwordCriteria = [
                { regex: /.{8,}/, message: "Pelo menos 8 caracteres." },
                { regex: /[A-Z]/, message: "Pelo menos uma letra maiúscula." },
                { regex: /[a-z]/, message: "Pelo menos uma letra minúscula." },
                { regex: /\d/, message: "Pelo menos um número." },
                { regex: /[!@#$%^&*]/, message: "Pelo menos um caractere especial." },
            ];

            const failedCriteria = passwordCriteria.filter(
                (criterion) => !criterion.regex.test(formData.password)
            );

            if (failedCriteria.length > 0) {
                newErrors.password = `Senha não atende aos critérios: ${failedCriteria
                    .map((c) => c.message)
                    .join(", ")}`;
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirmação de senha é obrigatória.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não correspondem.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            try {
                const response = await registerUser(formData);
                if (response.message && !response.error) {
                    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                    setAlert({
                        show: true,
                        message: "Cadastro realizado com sucesso!",
                        type: "success",
                    });
                    setTimeout(() => navigate("/"), 2500);
                } else if (response.error) {
                    setAlert({
                        show: true,
                        message: response.error,
                        type: "error",
                    });
                }
            } catch (error) {
                setAlert({
                    show: true,
                    message: error || "Ocorreu um erro inesperado.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        } else {
            setAlert({
                show: true,
                message: "Por favor, corrija os erros no formulário.",
                type: "error",
            });
        }
    };

    return {
        formData,
        errors,
        alert,
        showPassword,
        showConfirmPassword,
        showCriteries,
        loading,
        setLoading,
        handleInputChange,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        setsShowCriteries,
        setAlert,
    };
};
