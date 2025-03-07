import React, { useEffect, useState } from "react";
import { BannerLateral } from "../../Utils/BannerLateral";
import { AiOutlineMail, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoShieldCheckmark, IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AlertWindow } from "../../Utils/AlertWindow";
import "aos/dist/aos.css";
import { SphereSpinner } from "react-spinners-kit";
import { useCadastro } from "../../../hooks/useCadastro";
import { GoogleLoginButton } from "../../Utils/GoogleLoginButton";
import { Link } from "react-router-dom";
import Aos from "aos";

export const Cadastro = () => {
  const {
    formData,
    alert,
    showPassword,
    showConfirmPassword,
    loading,
    setLoading,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    setAlert,
    step,
    passwordCriteria,
    resendCode,
  } = useCadastro();

  const [code, setCode] = useState(new Array(6).fill(""));
  const handleChange = (value, index) => {
    if (!/^\d$/.test(value) && value !== "") return;

    const newCode = [...code];
    newCode[index] = value;
    formData.code = newCode.join("");
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    Aos.init({
      duration: 2000,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      {alert.show && (
        <AlertWindow message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
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
            {/* Etapa 1: Nome e Email */}
            {step === 1 && (
              <>
                <div className="flex flex-col gap-6">
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
                  </div>
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
                  </div>
                </div>
              </>
            )}
            {/* Etapa 2: Código de Verificação */}
            {step === 2 && (
              <div
                className="flex flex-col gap-4 p-2 bg-black rounded-xl shadow-lg text-white overflow-hidden"
                data-aos="fade-left"
              >
                <p className="text-center">
                  Digite o código enviado para <span className="text-primary60 underline">{formData.email}</span>
                </p>
                <div className="flex justify-center gap-2 overflow-hidden">
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
                  className="text-primary40 underline cursor-pointer hover:text-neutral20 w-fit text-center mx-auto"
                  onClick={resendCode}
                >
                  Reenviar Código
                </button>
              </div>
            )}
            {/* Etapa 3: Criar Senha */}
            {step === 3 && (
              <>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl"
                  >
                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar Senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 xl:p-4 text-base xl:text-2xl bg-black border-b rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-primary50 focus:border-none"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-4 xl:top-5 text-gray-400 text-2xl xl:text-3xl"
                  >
                    {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>

                  <div>
                    <ul className="text-sm text-gray-300 mt-3 flex flex-col gap-2">
                      <li
                        className={`${
                          passwordCriteria.length ? "line-through text-semanticSucess" : "text-semanticWarning"
                        } flex items-center gap-2`}
                      >
                        {passwordCriteria.length ? <IoShieldCheckmarkOutline size={20} /> : <IoShieldCheckmark size={20} />}{" "}
                        Mínimo de 8 caracteres
                      </li>
                      <li
                        className={`${
                          passwordCriteria.uppercase ? "line-through text-semanticSucess" : "text-semanticWarning"
                        } flex items-center gap-2`}
                      >
                        {passwordCriteria.uppercase ? <IoShieldCheckmarkOutline size={20} /> : <IoShieldCheckmark size={20} />}{" "}
                        Pelo menos 1 letra maiúscula
                      </li>
                      <li
                        className={`${
                          passwordCriteria.special ? "line-through text-semanticSucess" : "text-semanticWarning"
                        } flex items-center gap-2`}
                      >
                        {passwordCriteria.special ? <IoShieldCheckmarkOutline size={20} /> : <IoShieldCheckmark size={20} />}
                        Pelo menos 1 símbolo especial
                      </li>
                      <li
                        className={`${
                          passwordCriteria.match ? "line-through text-semanticSucess" : "text-semanticWarning"
                        } flex items-center gap-2`}
                      >
                        {passwordCriteria.match ? <IoShieldCheckmarkOutline size={20} /> : <IoShieldCheckmark size={20} />}
                        As senhas devem corresponder
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            {/* Botão de Continuar */}
            <div className="flex items-center justify-center w-full">
              <button
                className={`${
                  loading ? "opacity-50" : "w-full"
                } bg-primary90 text-white p-3 xl:p-4 text-base xl:text-2xl rounded-full font-semibold hover:bg-primary70 transition hover:scale-110
                } `}
                disabled={loading}
                type="submit"
              >
                {loading ? <SphereSpinner size={50} color="#fff" /> : "Continuar"}
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
              <Link to={"/"} className="pointer text-primary70 hover:underline">
                Login!
              </Link>
            </p>{" "}
          </div>
        </form>
      </div>
    </>
  );
};
