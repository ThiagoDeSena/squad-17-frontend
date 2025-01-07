import React, { useEffect, useState } from "react";
import { BannerLateral } from "../../Utils/BannerLateral";
import {
    AiOutlineMail,
    AiOutlineLock,
    AiFillEye,
    AiFillEyeInvisible,
} from "react-icons/ai";
import Aos from "aos";
import "aos/dist/aos.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { AlertWindow } from "../../Utils/AlertWindow";
import { MetroSpinner } from "react-spinners-kit";
import { loginUser } from "../../../services/authAPI";

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({
            duration: 2000,
            easing: "ease-in-out",
        });
    }, []);

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

    const handleLogin = async (e) => {
        e.preventDefault();

        if (validateFields()) {
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
                    setAlert({
                        show: true,
                        message:
                            "Login realizado com sucesso! Redirecionando...",
                        type: "success",
                    });
                    setTimeout(() => window.location.reload(), 4000);
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
        } else {
            setAlert({
                visible: true,
                message: "Por favor, corrija os erros no formulário.",
                type: "error",
            });
        }
    };

    return (
        <>
            {/* Alert Window */}
            {alert.show && (
                <AlertWindow
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            <div className="hidden xl:block">
                <BannerLateral />
            </div>

            <div
                className="absolute right-0 top-0 w-full h-screen xl:w-2/4 flex flex-col items-center justify-center overflow-hidden p-2"
                data-aos="zoom-in"
            >
                <div className="w-full md:w-2/4 xl:w-3/4 flex justify-center gap-5 items-center border border-neutral60 rounded-xl shadow-lg">
                    <div className="w-full flex flex-col gap-4 p-4 xl:px-12 rounded-lg text-white">
                        {/* Logo em Destaque */}
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
                            Login
                        </h1>

                        {/* Inputs */}
                        <form onSubmit={handleLogin}>
                            <div className="flex flex-col gap-6">
                                {/* Email */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="m@exemple.com"
                                        className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm  text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <AiOutlineMail className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                </div>
                                {/* Senha */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <AiOutlineLock className="absolute right-12 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl"
                                    >
                                        {showPassword ? (
                                            <AiFillEye />
                                        ) : (
                                            <AiFillEyeInvisible />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-row justify-between text-sm xl:text-lg">
                                    <label
                                        htmlFor="remember-me"
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 border-primary60"
                                            id="remember-me"
                                        />
                                        Lembrar-me
                                    </label>
                                    <a
                                        href="#"
                                        className="text-primary40 hover:underline"
                                        onClick={() => navigate("/forgot-password")}
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>
                            {/* Botão de Login */}
                            <div className="flex items-center justify-center w-full">
                                <button
                                    className={`${
                                        isLoading ? "opacity-50" : "w-full"
                                    } bg-primary90 text-white p-3 xl:p-4 text-base xl:text-2xl rounded-full font-semibold hover:bg-primary70 transition hover:scale-110`}
                                    disabled={isLoading}
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <MetroSpinner size={50} color="#fff" />
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Continue com Google */}
                        <div className="flex items-center my-2 xl:text-lg text-gray-400">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="mx-2">Continuar Com</span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </div>

                        <button className="w-[6em] flex justify-center m-auto items-center gap-3 bg-zinc-800 p-3 xl:p-4 text-base xl:text-2xl rounded-xl hover:bg-zinc-700 transition">
                            <FcGoogle size={44} />
                        </button>

                        {/* Criar conta */}
                        <p className="text-center text-sm xl:text-lg text-gray-400">
                            Não possui uma conta?{" "}
                            <a
                                href="#"
                                className="text-primary70 hover:underline"
                                onClick={() => navigate("/register")}
                            >
                                Criar Conta!
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
