import React, { useEffect, useState } from "react";
import { BannerLateral } from "../BannerLateral";
import {
    AiOutlineMail,
    AiOutlineLock,
    AiFillEye,
    AiFillEyeInvisible,
} from "react-icons/ai";
import { MdDriveFileRenameOutline } from "react-icons/md";

import Aos from "aos";
import "aos/dist/aos.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export const Cadastro = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({
            duration: 2000,
            easing: "ease-in-out",
        });
    }, []);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório.";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email é obrigatório.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email inválido.";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Senha é obrigatória.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Senha deve ter pelo menos 8 caracteres.";
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirmação de senha é obrigatória.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não correspondem.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log("Formulário enviado com sucesso:", formData);
            navigate("/");
        }
    };

    return (
        <>
            <div className="hidden xl:block">
                <BannerLateral />
            </div>

            {/* Formulário */}
            <div
                className="absolute right-0 top-0 w-full h-screen xl:w-2/4 flex flex-col items-center justify-center overflow-hidden p-5"
                data-aos="zoom-in"
            >
                <form
                    className="w-full md:w-3/4 xl:w-2/3 flex justify-center gap-5 items-center border border-neutral60 rounded-xl shadow-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full flex flex-col gap-6 p-4 xl:px-12 rounded-lg text-white">
                        <h1 className="text-5xl xl:text-6xl font-bold font-moonjelly text-center mb-6 text-white">
                            Register
                        </h1>

                        {/* Inputs */}
                        <div className="flex flex-col gap-6">
                            {/* Nome */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nome"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                />
                                <MdDriveFileRenameOutline className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                />
                                <AiOutlineMail className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Senha */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                />
                                <AiOutlineLock className="absolute right-12 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl"
                                >
                                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                                </button>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirmação de Senha */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirmar Senha"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                />
                                <AiOutlineLock className="absolute right-12 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl"
                                >
                                    {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                                </button>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Botão de Registrar */}
                        <button className="w-full bg-primary90 text-white p-3 xl:p-4 text-base xl:text-2xl rounded-full font-semibold hover:bg-primary70 transition hover:scale-110">
                            Register
                        </button>

                            {/* Continue com Google */}
                            <div className="flex items-center my-2 xl:text-lg text-gray-400">
                                <span className="flex-grow border-t border-gray-400"></span>
                                <span className="mx-2">Continuar Com</span>
                                <span className="flex-grow border-t border-gray-400"></span>
                            </div>

                            
                            <button className="w-[6em] flex justify-center m-auto items-center gap-3 bg-zinc-800 p-3 xl:p-4 text-base xl:text-2xl rounded-xl     hover:bg-zinc-700 transition">
                                <FcGoogle size={44} />
                            </button>

                            {/* Criar conta */}
                            <p className="text-center text-sm xl:text-lg text-gray-400">
                                Já Possui uma Conta?{" "}
                                <a
                                    href="#"
                                    className="text-primary70 hover:underline"
                                    onClick={() => navigate("/")}
                                >
                                    Login   !
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </>
        );
    };
