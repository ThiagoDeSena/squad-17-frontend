import React from "react";
import { FaHeart } from "react-icons/fa";

export const RecomendedCard = ({ image, title, genre, onAddToWatchlist }) => {
    return (
        <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-90">
            <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <button
                className="absolute top-2 right-2 bg-black/20 p-2 rounded-full text-white hover:bg-red-600 transition"
                onClick={onAddToWatchlist}
            >
                <FaHeart size={18} />
            </button>
            <div className="absolute bottom-0 w-full p-2 bg-black/20 backdrop-blur-md text-white">
                <h3 className="text-md font-semibold truncate">{title}</h3>
                <p className="text-sm text-gray-300 truncate">{genre}</p>
            </div>
        </div>
    );
};