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

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

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
                {" "}
                {/* Altere lg para xl */}
                <BannerLateral />
            </div>

            {/* Formulário */}
            <div
                className="absolute right-0 top-0 w-full h-full xl:w-2/4 flex flex-col items-center justify-center overflow-hidden"
                data-aos="zoom-in"
            >
                <div className="w-full md:w-3/4 xl:w-2/3 flex justify-center items-center border border-neutral-400 rounded-md shadow-lg">
                    <div className="w-full flex flex-col gap-6 p-10 xl:p-12 rounded-lg text-white bg-zinc-900">
                        <h1 className="text-5xl xl:text-6xl font-bold font-moonjelly text-center mb-6 text-white">
                            Login
                        </h1>
                        {/* Inputs */}
                        <div className="flex flex-col gap-6">
                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-zinc-800 border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                                <AiOutlineMail className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                            </div>
                            {/* Senha */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-zinc-800 border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                        </div>

                        {/* Botão de Login */}
                        <button className="w-full bg-yellow-500 text-black p-3 xl:p-4 text-base xl:text-2xl rounded-lg font-semibold hover:bg-yellow-600 transition">
                            Login
                        </button>

                        {/* Continue com Google */}
                        <div className="text-center text-gray-400 my-2 xl:text-lg">
                            Continue With
                        </div>
                        <button className="w-full flex justify-center items-center gap-3 bg-zinc-800 p-3 xl:p-4 text-base xl:text-2xl rounded-lg hover:bg-zinc-700 transition">
                            <FcGoogle className="text-2xl xl:text-3xl" />
                            <span>Google</span>
                        </button>

                        {/* Criar conta */}
                        <p className="text-center text-sm xl:text-lg text-gray-400">
                            Don't have an account?{" "}
                            <a
                                href="#"
                                className="text-yellow-500 hover:underline"
                            >
                                Create Account!
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
