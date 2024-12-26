import React, { useState } from "react";
import { ReviewContainer } from "./ReviewContainer"; // Componente de resenha

export const Feed = () => {
    const [activeTab, setActiveTab] = useState("bestReviews");
    const followedReviews = []


    return (
        <div className="bg-transparent text-white p-4 max-w-2xl md:max-w-4xl mx-auto mt-12 font-poppins mb-12">
            {/* Abas */}
            <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start mb-8 max-w-[300px] md:max-w-2xl relative left-[10%] md:left-0 mx-auto">
                <button
                    onClick={() => setActiveTab("bestReviews")}
                    className={`px-4 py-2 text-lg font-semibold rounded-lg shadow-md ${
                        activeTab === "bestReviews"
                            ? "bg-red-500 text-white"
                            : "bg-neutral80 text-neutral20 hover:bg-neutral50 hover:text-white transition duration-300"
                    }`}
                >
                    Melhores Avaliações
                </button>
                <button
                    onClick={() => setActiveTab("followedReviews")}
                    className={`px-4 py-2 text-lg font-semibold rounded-lg shadow-md ${
                        activeTab === "followedReviews"
                            ? "bg-red-500 text-white"
                            : "bg-neutral80 text-neutral20 hover:bg-neutral50 hover:text-white transition duration-300"
                    }`}
                >
                    Avaliações dos Usuários que Sigo
                </button>
            </div>

            {/* Conteúdo do Feed */}
            <div
                className={`relative left-8 lg:left-0 grid gap-6 ${
                    activeTab === "bestReviews" ? "animate-fade-in" : ""
                }`}
            >
                {activeTab === "bestReviews" && (
                    <div>
                        {/* Resenhas mais relevantes */}
                        <ReviewContainer movieId={845781} plataform="movie" />
                        <ReviewContainer movieId={125988} plataform="tv" />
                    </div>
                )}
                {activeTab === "followedReviews" && (
                    <div className="flex flex-col items-center text-center gap-4">
                        {/* Verifica se há postagens */}
                        {followedReviews.length === 0 ? (
                            <div className="bg-neutral90 p-2 rounded-xl w-2/3 lg:w-full">
                                <img
                                    src="/images/no-content.svg"
                                    alt="Sem conteúdo"
                                    className="w-[400px] h-[350px] mx-auto"
                                />
                                <p className="text-lg font-medium text-neutral-400">
                                    Você ainda não segue ninguém ou não há
                                    postagens disponíveis.
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Siga outros usuários para ver suas
                                    avaliações aqui!
                                </p>
                            </div>
                        ) : (
                            <div>
                                {/* Mapeie as resenhas aqui */}
                                {/* {followedReviews.map((review) => (
                                    <ReviewContainer
                                        key={review.id}
                                        movieId={review.movieId}
                                        plataform={review.plataform}
                                    />
                                ))} */}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
