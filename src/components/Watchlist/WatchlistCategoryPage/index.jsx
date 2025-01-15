import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WatchCard } from "../WatchCard";

export const WatchlistCategoryPage = ({ category }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [watchList, setWatchList] = useState({
        pending: [
            { id: 823219, media_type: "movie" },
            { id: 93405, media_type: "tv" },
            { id: 402431, media_type: "movie" },
        ],
        inProgress: [{ id: 426063, media_type: "movie" }],
        completed: [
            { id: 279283, media_type: "tv" },
            { id: 929204, media_type: "movie" },
            { id: 539972, media_type: "movie" },
            { id: 202879, media_type: "tv" },
            { id: 1059128, media_type: "movie" },
            { id: 93405, media_type: "tv" },
            { id: 1088514, media_type: "movie" },
            { id: 710295, media_type: "movie" },
            { id: 1261501, media_type: "movie" },
            { id: 157741, media_type: "tv" },
        ],
    });

    const navigate = useNavigate();
    const items = watchList[category] || [];

    const moveItem = (targetCategory) => {
        if (!selectedItem) return;
        setWatchList((prev) => {
            const newList = { ...prev };
            newList[category] = prev[category].filter(
                (i) => i.id !== selectedItem.id
            );
            newList[targetCategory].push(selectedItem);
            return newList;
        });
        setSelectedItem(null);
    };

    return (
        <div className="watchlist-category-page flex flex-col items-center p-8 bg-neutral90 min-h-screen">
            <div className="page-header flex items-center gap-2 mb-8">
                <h1 className="text-5xl font-semibold text-neutral10 font-moonjelly underline">
                    {category === "pending"
                        ? "Pendente"
                        : category === "inProgress"
                        ? "Em Progresso"
                        : "Assistidos"}
                </h1>
            </div>

            {items.length === 0 ? (
                <div
                    className="text-center text-neutral10 mt-10 flex flex-col items-center
                justify-center relative left-6 md:left-0"
                >
                    <img
                        src="/images/asking-question.svg"
                        alt="empty"
                        className="mx-auto mb-4 w-60"
                    />
                    <h2 className="text-3xl font-semibold mb-4 font-moonjelly">
                        Ooops!
                    </h2>
                    <p className="text-lg font-poppins w-60">
                        Parece que você ainda não tem nenhum item nesta
                        categoria.
                    </p>
                </div>
            ) : (
                <div className="items-container flex flex-wrap justify-center gap-12 w-full relative  left-[7vw] md:left-0">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="relative w-[350px]  md:w-[450px] h-[650px]"
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() =>
                                setTimeout(() => setHoveredItemId(null), 1500)
                            }
                        >
                            <WatchCard
                                mediaType={item.media_type}
                                id={item.id}
                                className="relative w-full h-full rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-95 font-poppins mb-4 ease-linear duration-300"
                            />
                            {hoveredItemId === item.id && (
                                <button
                                    className="absolute top-4 left-4 px-3 py-1 bg-primary20 text-white rounded-md text-sm hover:bg-primary30 font-moonjelly"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    Mover
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-poppins ">
                    <div className="bg-neutral90 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg text-neutral10 font-moonjelly font-semibold mb-4">
                            Mover para...
                        </h2>
                        <select
                            className="w-full px-4 py-2 border rounded-md bg-neutral40 border-none text-neutral90"
                            onChange={(e) => moveItem(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecione a categoria
                            </option>
                            {category !== "pending" && (
                                <option value="pending">Pendente</option>
                            )}
                            {category !== "inProgress" && (
                                <option value="inProgress">Em Progresso</option>
                            )}
                            {category !== "completed" && (
                                <option value="completed">Assistidos</option>
                            )}
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                                onClick={() => setSelectedItem(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-primary40 text-white rounded-md"
                                onClick={() => moveItem(selectedItem)}
                            >
                                Mover
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
