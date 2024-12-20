import React, { useEffect, useState } from "react";
import { BannerLateral } from "../BannerLateral";
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

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({
            duration: 2000,
            easing: "ease-in-out",
        });
    }, []);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
                        <div className="flex flex-col gap-6">
                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="m@exemple.com"
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm  text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                />
                                <AiOutlineMail className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                            </div>
                            {/* Senha */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
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
                                <label htmlFor="remember-me" className="flex items-center gap-2">
                                    <input type="checkbox" className="w-4 h-4 border-primary60" id="remember-me"/>
                                    Lembrar-me
                                </label>

                                <a href="#" className="text-primary40 hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>

                        </div>

                        {/* Botão de Login */}
                        <button className="w-full bg-primary60 text-white p-3 xl:p-4 text-base xl:text-2xl rounded-full font-semibold hover:bg-primary50 transition hover:scale-110 ">
                            Login
                        </button>

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
