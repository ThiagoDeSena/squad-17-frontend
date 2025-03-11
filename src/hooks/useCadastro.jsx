import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, sendVerificationCode, verifyCode } from "../api/authAPI";
import { UserContext } from "../Contexts/UserContext";

export const useCadastro = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    special: false,
    match: false,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePasswordCriteria(value, formData.confirmPassword);
    } else if (name === "confirmPassword") {
      validatePasswordCriteria(formData.password, value);
    }
  };

  const validatePasswordCriteria = (password, confirmPassword) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && confirmPassword.length > 0,
    });
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
      if (!formData.email.trim()) {
        newErrors.email = "Email é obrigatório.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email inválido.";
      }
    }

    if (step === 2) {
      if (!formData.code.trim()) {
        newErrors.code = "Código de verificação é obrigatório.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendVerification = async (email) => {
    setLoading(true);
    try {
      const response = await sendVerificationCode(email);
      setAlert({ show: true, message: response.message, type: "success" });
      return response.data;
    } catch (error) {
      console.log(error)
      setErrors(error.response.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyCodeVerification = async (email, code) => {
    try {
      const response = await verifyCode(email, code);
      setAlert({ show: true, message: response.message, type: "success" });
      return response.data;
    } catch (error) {
      console.error("Erro ao confirmar código de validação:", error.response.data.error);
      setAlert({ show: true, message: error.response.data.error, type: "error" });
      throw error;
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      if (step === 1) {
        await sendVerification(formData.email); // Envia o código de verificação
        setStep(2); // Avança para a etapa 2 (Código de Verificação)
      } else if (step === 2) {
        await verifyCodeVerification(formData.email, formData.code);
        setStep(3);
      } else if (step === 3) {
        const response = await registerUser(formData); // Faz o registro
        if (response.message && !response.error) {
          setAlert({ show: true, message: "Cadastro realizado!", type: "success" });
          setTimeout(async () => {
            const loginResponse = await loginUser(formData.email, formData.password);
            login(loginResponse.token, loginResponse.refreshToken);
            navigate("/feed");
          }, 2000);
        } else {
          setAlert({ show: true, message: response.error, type: "error" });
        }
      }
    } catch (error) {
      console.log(errors)
      setAlert({ show: true, message: errors, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.show) {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  }, [alert.show]);

  const resendCode = async () => {
    try {
      const response = await sendVerification(formData.email);
      setAlert({ show: true, message: response.message, type: "success" });
    } catch (error) {
      console.error("Error ao enviar código de validação:", error);
      setAlert({ show: true, message: error.response.data, type: "error" });
    }
  };

  return {
    errors,
    passwordCriteria,
    resendCode,
    verifyCodeVerification,
    sendVerification,
    alert,
    setAlert,
    showPassword,
    showConfirmPassword,
    loading,
    setLoading,
    handleInputChange,
    handleSubmit,
    step,
    formData,
    prevStep,
    togglePasswordVisibility: () => setShowPassword(!showPassword),
    toggleConfirmPasswordVisibility: () => setShowConfirmPassword(!showConfirmPassword),
  };
};
