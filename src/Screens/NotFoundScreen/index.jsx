import React from "react";
import { SideBar } from "../../components/SideBar";

export const NotFoundScreen = () => {
    return (
        <div className="flex">
            {/* Sidebar (se necessário, pode ser modificada para não afetar o layout centralizado) */}
            <SideBar />

            {/* Conteúdo principal (Página 404) */}
            <div className="flex-1 flex items-center justify-center p-6 min-h-screen font-poppins">
                <div className="text-center">
                    <h1 className="text-primary50 text-2xl font-bold mb-12">
                        Oops! A página que você tentou acessar não existe.
                    </h1>
                    <img src="/images/404.svg" alt="Imagem 404" className="w-[100%] mx-auto mb-12" />
                    <button 
                        className="bg-primary30 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary60 transition duration-300"
                        onClick={() => window.location.href = '/'} // Redireciona para a página inicial
                    >
                        VOLTAR PARA HOME
                    </button>
                </div>
            </div>
        </div>
    );
};
