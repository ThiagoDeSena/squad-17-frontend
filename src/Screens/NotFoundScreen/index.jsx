import React from "react";
import { SideBar } from "../../components/SideBar";
import { useNavigate } from "react-router-dom";

export const NotFoundScreen = () => {
    document.body.style.backgroundColor = '#191919'
    const navigate = useNavigate();
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 flex items-center justify-center p-6 min-h-screen font-poppins">
                <div className="text-center relative left-8 md:left-0">
                    <h1 className="text-primary50 md:text-2xl font-bold mb-12 w-[70%] md:w-[100%] mx-auto">
                        Oops! A página que você tentou acessar não existe.
                    </h1>
                    <img src="/images/404.svg" alt="Imagem 404" className="w-[70%] md:w-[100%] mx-auto mb-12" />
                    <button 
                        className="bg-primary30 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary60 transition duration-300"
                        onClick={() => navigate("/")}
                    >
                        VOLTAR PARA HOME
                    </button>
                </div>
            </div>
        </div>
    );
};
