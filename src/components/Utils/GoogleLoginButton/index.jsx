
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { loginWithGoogle } from "../../../services/authAPI";
import { UserContext } from "../../../Contexts/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleLoginButton = ({ isLoading, setIsLoading, alert, setAlert }) => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate()
    const handleGoogleLogin = async (response) => {
        console.log(response);
        if (!response || !response.credential) {
            setAlert({
                show: true,
                message: 'Autenticação com Google falhou. Tente novamente.',
                type: 'error'
            })
            return;
        }
        try {
            const rest = await loginWithGoogle(response.credential);
            if (rest.error) {
                setAlert({
                    show: true,
                    message: rest.message,
                    type: "error",
                });
            } else {
                const { token } = rest;
                setAlert({
                    show: true,
                    message: rest.message,
                    type: "success",
                });
                setTimeout(() => {
                    login(token);
                    navigate("/feed");
                }, 2500);
                
            }
        } catch (error) {
            console.error("Erro ao autenticar com Google:", error);
            setAlert({
                show: true,
                message: 'Erro ao autenticar com Google. Tente novamente.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
           {!isLoading && <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                    setAlert({
                        show: true,
                        message: "Autenticação com Google falhou. Tente novamente.",
                        type: "error",
                    });
                    setIsLoading(false);
                }}
                click_listener={() => setIsLoading(true)}
                type="standard"
                theme="filled_black"
                size="large"
                text="with"
                shape="pill"
                width="100%"
                icon={false}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2 px-4 border border-neutral80 rounded-full hover:border-neutral90 transition duration-150 ease-in-out"
            />}

            {isLoading && 
                 <button
                 className={`w-[80px] h-[80px] flex justify-center items-center 
                             bg-zinc-800 p-2 rounded-md 
                             hover:bg-zinc-700 transition 
                             text-center mx-auto
                             ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                 disabled={isLoading}
             >
                 <FcGoogle size={60} />
             </button>
            }
        </div>
    );
};

