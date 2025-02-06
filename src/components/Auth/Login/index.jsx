import React, { useEffect } from "react";
import { useLogin } from "../../../hooks/useLogin";
import { BannerLateral } from "../../Utils/BannerLateral";
import { AlertWindow } from "../../Utils/AlertWindow";
import { MetroSpinner } from "react-spinners-kit";
import {
    AiOutlineMail,
    AiOutlineLock,
    AiFillEye,
    AiFillEyeInvisible,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { GoogleLoginButton } from "../../Utils/GoogleLoginButton";

export const Login = () => {
    const {
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
    } = useLogin();

    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({
            duration: 2000,
            easing: "ease-in-out",
        });
    }, []);
    return (
        <>
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
                className="fixed right-0 top-4 w-full max-h-[100vh] xl:w-2/4 flex flex-col items-center justify-center p-2"
                data-aos="zoom-in"
            >
                <div className="w-full md:w-2/4 xl:w-3/4 flex justify-center gap-6 items-center border border-neutral60 rounded-xl shadow-lg overflow-auto">
                    <div className="w-full flex flex-col gap-4 p-4 xl:px-12 rounded-lg text-white  max-h-full">
                        {/* Logo em Destaque */}
                        <div className="flex flex-col items-center mb-4 md:mt-4">
                            <img
                                src="/images/logo.svg"
                                alt="Logo da Aplicação"
                                className="w-32 h-32 xl:w-36 xl:h-36"
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                        >
                            <div className="flex flex-col gap-6">
                                {/* Email */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="m@exemple.com"
                                        className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                        value={email}
                                        required
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                    <AiOutlineMail className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                </div>
                                {/* Senha */}
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="********"
                                        className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        disabled={isLoading}
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
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 border-primary60"
                                            id="remember-me"
                                            draggable="false"
                                            checked={remeberMe}
                                            onChange={handleRememberMeChange}
                                        />
                                        Lembrar-me
                                    </label>
                                    <a
                                        href="#"
                                        className="text-primary40 hover:underline"
                                        onClick={() =>
                                            navigate("/forgot-password")
                                        }
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>
                            {/* Botão de Login */}
                            <div className="flex items-center justify-center w-full">
                                <button
                                    className={`${isLoading ? "opacity-50" : "w-full"
                                        } bg-primary90 text-white p-3 xl:p-4 text-base xl:text-2xl rounded-full font-semibold hover:bg-primary70 transition hover:scale-105 ease-linear duration-300 cursor-pointer`}
                                    disabled={isLoading || !email || !password}
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <MetroSpinner size={24} color="#fff" />
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </form>


                        <div className="flex items-center my-2 xl:text-lg text-gray-400">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="mx-2">Continuar Com</span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </div>

                        {/* Continue com Google */}
                        <div>
                            <GoogleLoginButton isLoading={isLoading} setIsLoading={setIsLoading} alert={alert} setAlert={setAlert}/>
                        </div>

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
