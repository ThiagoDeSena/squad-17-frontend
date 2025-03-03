import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { searchResults } from "../../api/movieAPI";
import { SearchBanner } from "./SearchBanner";
import { Loading } from "../Utils/Loading";
import { useInView } from "react-intersection-observer";

export const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const {ref, inView } = useInView({threshold: 1}); 

    useEffect(() => {
        if (!searchTerm) return;
        setPage(1);
        searchResults([]);
        setHasMore(true);
    }, [searchTerm]);

    useEffect(() => {
        if (!searchTerm) return;
        const fetchData = async () => {
            setError("");
            setIsLoading(true);
            try {
                const { success, data, message } = await searchResults(
                    searchTerm,
                    { page }
                );
                if (success) {
                    setResults((prevResults) =>
                        page === 1
                            ? data
                            : [
                                  ...prevResults,
                                  ...data.filter(
                                      (newItem) =>
                                          !prevResults.some(
                                              (item) => item.id === newItem.id
                                          )
                                  ),
                              ]
                    );
                    setHasMore(data.length > 0);
                } else {
                    setError(message);
                }
            } catch (err) {
                setError(
                    "Erro ao buscar os resultados. Tente novamente mais tarde."
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [searchTerm, page]);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            setPage((prev) => prev + 1);
        }
    }, [inView, hasMore, isLoading]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1);
        setResults([]);
    };

    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#181818]">
            {/* Formulário de Busca */}
            <form
                onSubmit={handleSearch}
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg mx-auto w-[80%] md:w-full md:max-w-2xl absolute top-4 left-[15%] md:left-0 right-0 z-10"
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    enterKeyHint="search"
                    placeholder="Busque por filmes, séries..."
                    className="flex-grow border border-gray-600 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-primary60 bg-neutral10 text-neutral90 font-bold placeholder-neutral90 sm:w-full"
                />

                {searchTerm && (
                    <>
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="ml-2 text-gray-500 hover:text-white transition duration-300"
                        >
                            <FiX size={25} className="text-primary80" />
                        </button>
                    </>
                )}
            </form>

            {/* Resultados */}
            {searchTerm && (
                <h3 className="relative text-3xl sm:text-3xl md:text-5xl text-white font-moonjelly mt-24 mb-4 flex items-center left-[4%] md:left-0 justify-center mx-auto text-center w-full">
                    {isLoading
                        ? "Buscando..."
                        : `Resultados para "${searchTerm}"`}
                </h3>
            )}

            <div className="w-[80%] md:w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10 mt-6 p-4 relative left-[8%] md:left-8 sm:mx-auto">
                {searchTerm &&
                    results.map(
                        (item, index) =>
                            item.backdrop_path && !item.adult && (
                                <div
                                    key={item.id}
                                    className="p-2"
                                    ref={index === results.length - 1 ? ref : null}
                                >
                                    <SearchBanner
                                        image={`https://image.tmdb.org/t/p/w500/${
                                            item.poster_path ||
                                            item.backdrop_path
                                        }`}
                                        title={item.title || item.name}
                                        genre={item.genre_ids}
                                        type={item.media_type}
                                        id={item.id}
                                        year={
                                            item.realesed_date ||
                                            item.first_air_date ||
                                            item.release_date
                                        }
                                        className="relative w-full h-96 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-125 shadow-stone-600 font-poppins mx-auto ease-linear duration-300"
                                    />
                                </div>
                            )
                    )}
            </div>

            {/* Empty search */}
            {!searchTerm && (
                <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-1/2 sm:w-3/4 w-11/12">
                    <p className="mt-4 text-2xl md:text-xl text-neutral20 font-poppins text-center md:px-12 px-6">
                        Bem-vindo! Digite algo na barra de busca acima para
                        encontrar filmes e séries.
                    </p>
                    <img
                        src="/images/search.svg"
                        alt="Search"
                        className="w-[50%] md:w-[60%] mx-auto mb-12 md:max-w-[250px]"
                    />
                </div>
            )}

            {/* Feedback */}
            {isLoading && <Loading />}

            {error && results.length === 0 && (
                <p className="mt-4 text-semanticError absolute top-20">
                    {error}
                </p>
            )}

            {/* Caso não haja nenhum resultado */}
            {results.length === 0 && !isLoading && searchTerm && (
                <p className="mt-6 text-white">
                    Nenhum resultado encontrado para "{searchTerm}".
                </p>
            )}
        </div>
    );
};
