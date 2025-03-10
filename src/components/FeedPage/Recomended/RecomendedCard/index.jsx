import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addToWatchList, isToTheWatchList, removeToWatchlist } from "../../../../api/watchlistApi";


const genres = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "Histórico",
    27: "Terror",
    10402: "Mistério",
    9648: "Romance",
    878: "Ficção Científica",
    10770: "TV Movie",
    53: "Suspense",
    10752: "Guerra",
    37: "Faroeste",
    10759: "Ação e Aventura",
    10762: "Infantil",
    10763: "Notícias",
    10764: "Realidade",
    10765: "Sci-Fi & Fantasia",
    10766: "Drama Familiar",
    10767: "Comédia de Drama",
    default: "Outro",
};

export const RecomendedCard = ({
    image,
    title,
    genre = [],
    className,
    type,
    id,
    review = false
}) => {
    const navigate = useNavigate();
    const genreString = Array.isArray(genre) && genre.length > 0
        ? genre.map((g) => genres[g] || genres.default).join(", ")
        : genres.default;

    const [inWatchList, setInWatchList] = useState(false);
    useEffect(() => {
        const checkWatchlist = async () => {
            try {
                setTimeout( async () => {
                    const response = await isToTheWatchList(id, type);
                    setInWatchList(!!response);
                }, 2500)
            } catch (error) {
                console.error(error)
            }
        }
        checkWatchlist();
    }, [id, type,])

    const handleWatchlistToggle = async (e) => {
        e.stopPropagation();
        try {
            if (inWatchList) {
                const response = await removeToWatchlist(id, type);
                if (response === 204) setInWatchList(false);
            } else {
                const response = await addToWatchList(id, type);
                if (response) setInWatchList(true);
            }
        } catch (error) {
            console.error("Erro ao atualizar watchlist:", error);
        }
    };

    return (
        <div
            className={className}
            onClick={() => navigate(`/media/${type}/${id}`)}
        >
            <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <button
                className={`absolute top-2 right-2 ${inWatchList ? 'bg-red-600' : 'bg-black/20'} p-2 rounded-full text-white ${inWatchList ? 'hover:bg-black/20' : 'hover:bg-red-600'} transition duration-200`}
                onClick={handleWatchlistToggle}
            >
                <FaHeart size={18} />
            </button>
            <div className="absolute bottom-0 w-full p-2 bg-black/20 backdrop-blur-md text-white">
                <h3 className="text-md font-semibold truncate">{title}</h3>
                <p className="text-sm text-gray-300 truncate">
                    {review ? genre : genreString}
                </p>
            </div>
        </div>
    );
};


