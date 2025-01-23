import React, { useState, useEffect } from "react";
import { BannerLateral } from "../../Utils/BannerLateral";
import {
    AiOutlineMail,
    AiOutlineLock,
    AiFillEye,
    AiFillEyeInvisible,
} from "react-icons/ai";
import Aos from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { AlertWindow } from "../../Utils/AlertWindow";
import { resetPassword, sendEmailRecoverPassword, validateCode } from "../../../services/authAPI";

export const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        special: false,
        match: false,
    });

    const [code, setCode] = useState(new Array(6).fill(""));

    const handleChange = (value, index) => {
      if (!/^\d$/.test(value) && value !== "") return; // Aceita apenas números
  
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
  
      // Avança automaticamente para o próximo campo
      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    };
  
    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus();
      }
    };
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({
            duration: 2000,
            easing: "ease-in-out",
        });
    }, []);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "newPassword") {
            validatePasswordCriteria(value, formData.confirmPassword);
        } else if (name === "confirmPassword") {
            validatePasswordCriteria(formData.newPassword, value);
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

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const response = await sendEmailRecoverPassword(formData.email);
            if (response.message) {
                setAlert({ message: response.message, type: "success" });
                setStep(2);
            }else if(response.error){
                setAlert({ message: response.error, type: "error" });
            }
        } catch (error) {
            setAlert({ message: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            let transformCode = code.join("");
            const response = await validateCode(transformCode);
            if (response.sucess) {
                setAlert({ message: "Código correto.", type: "success" });
                setStep(3);
            } else {
                throw new Error("Código incorreto.");
            }
        } catch (error) {
            setAlert({ message: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try { 
            let transformCode = code.join("");
            const response = await resetPassword(transformCode,formData.email, formData.newPassword, formData.confirmPassword);

            if (response.message) {
                setAlert({
                    message: "Senha alterada com sucesso! Redirecionando...",
                    type: "success",
                });
                setTimeout(() => navigate("/"), 4000);
            } else {
                throw new Error("A senha não atende todos os requisitos.");
            }
        } catch (error) {
            setAlert({ message: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="hidden xl:block">
                <BannerLateral />
            </div>

            <div
                className="absolute right-0 top-0 w-full h-screen xl:w-2/4 flex flex-col items-center justify-center overflow-hidden p-2"
                data-aos="zoom-in"
            >
                <div className="w-full md:w-2/4 xl:w-3/4 flex justify-center gap-5 items-center border border-neutral60 rounded-xl shadow-lg">
                    <div className="w-full flex flex-col gap-4 p-4 xl:px-12 rounded-lg text-white">
                        {alert.message && (
                            <AlertWindow
                                message={alert.message}
                                type={alert.type}
                            />
                        )}

                        <div className="flex flex-col items-center mb-4">
                            <img
                                src="/images/logo.svg"
                                alt="Logo da Aplicação"
                                className="w-32 h-32 xl:w-24 xl:h-24"
                            />
                            <p className="text-[1em] xl:text-[1.2em] font-semibold text-primary30 text-center">
                                Descubra, avalie e compartilhe filmes e séries
                                com quem entende você! 🎬✨
                            </p>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-bold font-moonjelly text-center mb-2 text-white">
                            Recuperar Senha
                        </h1>

                        {loading && (
                            <div className="flex justify-center">
                                <div className="loader w-12 h-12 border-4 border-t-primary30 border-gray-200 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {!loading && step === 1 && (
                            <form
                                onSubmit={handleSubmitEmail}
                                className="flex flex-col gap-4 p-6 bg-black rounded-xl shadow-lg text-white"
                                data-aos="fade-left"
                            >
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Digite seu e-mail"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-800 border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50"
                                        required
                                    />
                                    <AiOutlineMail className="absolute right-3 top-3 text-gray-400 text-xl" />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary90 text-white p-3 rounded-full hover:bg-primary70"
                                >
                                    Enviar código
                                </button>
                            </form>
                        )}

                        {!loading && step === 2 && (
                            <form
                            onSubmit={handleSubmitCode}
                            className="flex flex-col gap-4 p-6 bg-black rounded-xl shadow-lg text-white"
                            data-aos="fade-left"
                          >
                            <p className="text-center">Digite o código enviado para <span className="text-primary60 underline">{formData.email}</span></p>
                            <div className="flex justify-center gap-2">
                              {code.map((digit, index) => (
                                <input
                                  key={index}
                                  id={`code-input-${index}`}
                                  type="text"
                                  value={digit}
                                  onChange={(e) => handleChange(e.target.value, index)}
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  maxLength={1}
                                  className="w-12 h-12 text-center bg-gray-800 border-b rounded-sm text-white text-2xl focus:outline-none focus:ring-2 focus:ring-primary50"
                                />
                              ))}
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-primary90 text-white p-3 rounded-full hover:bg-primary70"
                            >
                              Confirmar Código
                            </button>
                          </form>
                        )}

                        {!loading && step === 3 && (
                            <form
                                onSubmit={handleSubmitNewPassword}
                                className="flex flex-col gap-4 p-6 bg-black rounded-xl shadow-lg text-white"
                                data-aos='fade-laft'
                            >
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="newPassword"
                                        placeholder="Digite a nova senha"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-800 border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50"
                                    />
                                    <AiOutlineLock className="absolute right-12 top-3 text-gray-400 text-xl" />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-3 text-gray-400 text-xl"
                                    >
                                        {showPassword ? (
                                            <AiFillEye />
                                        ) : (
                                            <AiFillEyeInvisible />
                                        )}
                                    </button>
                                </div>
                                <div>
                                    <ul className="text-sm text-gray-300 mb-3">
                                        <li
                                            className={
                                                passwordCriteria.length
                                                    ? "line-through text-green-400"
                                                    : ""
                                            }
                                        >
                                            - Mínimo de 8 caracteres
                                        </li>
                                        <li
                                            className={
                                                passwordCriteria.uppercase
                                                    ? "line-through text-green-400"
                                                    : ""
                                            }
                                        >
                                            - Pelo menos 1 letra maiúscula
                                        </li>
                                        <li
                                            className={
                                                passwordCriteria.special
                                                    ? "line-through text-green-400"
                                                    : ""
                                            }
                                        >
                                            - Pelo menos 1 símbolo especial
                                        </li>
                                        <li
                                            className={
                                                passwordCriteria.match
                                                    ? "line-through text-green-400"
                                                    : ""
                                            }
                                        >
                                            - As senhas devem corresponder
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="confirmPassword"
                                        placeholder="Confirme a nova senha"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-800 border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50"
                                    />
                                    <AiOutlineLock className="absolute right-12 top-3 text-gray-400 text-xl" />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-3 text-gray-400 text-xl"
                                    >
                                        {showPassword ? (
                                            <AiFillEye />
                                        ) : (
                                            <AiFillEyeInvisible />
                                        )}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary90 text-white p-3 rounded-full hover:bg-primary70"
                                >
                                    Alterar Senha
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
