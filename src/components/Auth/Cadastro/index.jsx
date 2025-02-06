import React, { useEffect, useState } from "react";
import { BannerLateral } from "../../Utils/BannerLateral";
import {
    AiOutlineMail,
    AiOutlineLock,
    AiFillEye,
    AiFillEyeInvisible,
} from "react-icons/ai";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AlertWindow } from "../../Utils/AlertWindow";
import Aos from "aos";
import "aos/dist/aos.css";
import { SphereSpinner } from "react-spinners-kit";
import { useCadastro } from "../../../hooks/useCadastro";
import { GoogleLoginButton } from "../../Utils/GoogleLoginButton";

export const Cadastro = () => {
    const {
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
    } = useCadastro();

    return (
        <>
            {alert.show && (
                <AlertWindow
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false })}
                />
            )}

            <div className="hidden xl:block">
                <BannerLateral />
            </div>

            {/* Formulário */}
            <div
                className="fixed right-0 top-10 md:top-0 w-full max-h-[100vh] xl:w-2/4 flex flex-col items-center justify-center overflow-hidden p-4"
                data-aos="zoom-in"
            >
                <form
                    className="w-full md:w-3/4 xl:w-2/3 flex justify-center gap-5 items-center border border-neutral60 rounded-xl shadow-lg overflow-auto"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full flex flex-col gap-6 p-4 xl:px-12 rounded-lg text-white">
                        <h1 className="text-5xl xl:text-6xl font-bold font-moonjelly text-center mb-2 mt-0 md:mt-6 text-white">
                            Cadastro
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
                                    disabled={loading}
                                />
                                <MdDriveFileRenameOutline className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
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
                                    disabled={loading}
                                />
                                <AiOutlineMail className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Senha */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onFocus={() => setsShowCriteries(true)}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            setsShowCriteries(false);
                                        }, 2000);
                                    }}
                                    disabled={loading}
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
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}

                                {/* Critérios de Senha */}
                                {showCriteries && (
                                    <ul className="mt-2 text-sm text-neutral10">
                                        <li
                                            className={
                                                /.{8,}/.test(formData.password)
                                                    ? "text-green-500 line-through"
                                                    : ""
                                            }
                                        >
                                            Pelo menos 8 caracteres.
                                        </li>
                                        <li
                                            className={
                                                /[A-Z]/.test(formData.password)
                                                    ? "text-green-500 line-through"
                                                    : ""
                                            }
                                        >
                                            Pelo menos uma letra maiúscula.
                                        </li>
                                        <li
                                            className={
                                                /[a-z]/.test(formData.password)
                                                    ? "text-green-500 line-through"
                                                    : ""
                                            }
                                        >
                                            Pelo menos uma letra minúscula.
                                        </li>
                                        <li
                                            className={
                                                /\d/.test(formData.password)
                                                    ? "text-green-500 line-through"
                                                    : ""
                                            }
                                        >
                                            Pelo menos um número.
                                        </li>
                                        <li
                                            className={
                                                /[!@#$%^&*]/.test(
                                                    formData.password
                                                )
                                                    ? "text-green-500 line-through"
                                                    : ""
                                            }
                                        >
                                            Pelo menos um caractere especial.
                                        </li>
                                        <li
                                            className={
                                                formData.password ===
                                                    formData.confirmPassword &&
                                                    formData.confirmPassword
                                                        .length > 0
                                                    ? "text-green-500 line-through"
                                                    : ""
                                            }
                                        >
                                            As senhas devem iguais
                                        </li>
                                    </ul>
                                )}
                            </div>

                            {/* Confirmação de Senha */}
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirmar Senha"
                                    value={formData.confirmPassword}
                                    disabled={loading}
                                    onChange={handleInputChange}
                                    onFocus={() => setsShowCriteries(true)}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            setsShowCriteries(false);
                                        }, 2000);
                                    }}
                                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                                />
                                <AiOutlineLock className="absolute right-12 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl" />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl"
                                >
                                    {showConfirmPassword ? (
                                        <AiFillEye />
                                    ) : (
                                        <AiFillEyeInvisible />
                                    )}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Botão de Registrar */}
                        <div className="flex items-center justify-center w-full">
                            <button
                                className={`${loading ? "opacity-50" : "w-full"
                                    } bg-primary90 text-white p-3 xl:p-4 text-base xl:text-2xl rounded-full font-semibold hover:bg-primary70 transition hover:scale-110`}
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? (
                                    <SphereSpinner size={50} color="#fff" />
                                ) : (
                                    "Cadastro"
                                )}
                            </button>
                        </div>

                        {/* Continue com Google */}
                        <div className="flex items-center my-2 xl:text-lg text-gray-400">
                            <span className="flex-grow border-t border-gray-400"></span>
                            <span className="mx-2">Continuar Com</span>
                            <span className="flex-grow border-t border-gray-400"></span>
                        </div>

                        {/* Continue com Google */}
                        <div>
                            <GoogleLoginButton isLoading={loading} setIsLoading={setLoading} alert={alert} setAlert={setAlert} />
                        </div>

                        {/* Criar conta */}
                        <p className="text-center text-sm xl:text-lg text-gray-400">
                            Já Possui uma Conta?{" "}
                            <a
                                href="/"
                                className="pointer text-primary70 hover:underline"
                            >
                                Login!
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};
