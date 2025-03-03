import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WatchCard } from "../WatchCard";
import { categoryMoved, getWatchList, removeToWatchlist } from "../../../api/watchListApi";
import { useEffect } from "react";
import { AlertWindow } from "../../Utils/AlertWindow";
import { useInView } from "react-intersection-observer";

export const WatchlistCategoryPage = ({ category }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [watchList, setWatchList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "",
    });
    const { ref, inView } = useInView({ threshold: 1 });
    useEffect(() => {
        setPage(0);
        setWatchList([]);
        setHasMore(true);
    }, [category]);
    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!hasMore) return
            try {
                const categoryMov = {
                    pending: "pendente",
                    inProgress: "em_progresso",
                    completed: "assistido"
                }
                const statusCategory = categoryMov[category];
                const { content, ...more } = await getWatchList(statusCategory, page);
                setHasMore(!more.empty)
                if (content) {
                    setWatchList((prevRes) =>
                        page === 0
                            ? content
                            : [
                                ...prevRes,
                                ...content.filter(
                                    (newItem) =>
                                        !prevRes.some(
                                            (item) => item.id === newItem.id
                                        )
                                ),
                            ]
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchWatchlist()
    }, [page])


    useEffect(() => {
        if (inView && hasMore) setPage(prev => prev + 1)
    }, [inView, hasMore]);


    const handleRemove = async (id, mediaType) => {
        try {
            await removeToWatchlist(id, mediaType);
            setWatchList((prevList) => prevList.filter(item => item.mediaId !== id));
        } catch (error) {
            console.error("Erro ao remover da Watchlist:", error);
        }
    };

    const moveItem = async (targerId, targetCategory, mediaId) => {
        if (!selectedItem) return;
        try {
            const response = await categoryMoved(targerId, targetCategory);
            setWatchList((prevList) => prevList.filter(item => item.mediaId !== mediaId));
            setSelectedItem(null);
            setAlert({
                show: true,
                message: `Item movido com sucesso`,
                type: "success",
            });
            return;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({ show: false, message: "", type: "" });
            }, 3000);
        }
    }, [alert.show])


    return (
        <>
            {alert.show && (
                <AlertWindow
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false })}
                />
            )}
            <div className="overflow-hidden flex flex-col items-center p-8 bg-neutral90 min-h-screen">
                <div className="page-header flex items-center gap-2 mb-8">
                    <h1 className="text-5xl font-semibold text-neutral10 font-moonjelly underline">
                        {category === "pending"
                            ? "Pendente"
                            : category === "inProgress"
                                ? "Em Progresso"
                                : "Assistidos"}
                    </h1>
                </div>

                {watchList.length === 0 ? (
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
                        {watchList.map((item, index) => (
                            <div
                                key={item.id}
                                className="relative w-[350px] md:w-[450px] h-[650px]"
                                onMouseEnter={() => setHoveredItemId(item.mediaId)}
                                onMouseLeave={() =>
                                    setTimeout(() => setHoveredItemId(null), 1500)
                                }
                                ref={index === watchList.length - 1 ? ref : null}
                            >
                                <WatchCard
                                    mediaType={item.mediaType}
                                    id={item.mediaId}
                                    className="relative w-full h-full rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-95 font-poppins mb-4 ease-linear duration-300"
                                    onRemove={handleRemove}
                                />
                                {hoveredItemId === item.mediaId && (
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
                                defaultValue=""
                                onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                            >
                                <option value="" disabled>
                                    Selecione a categoria
                                </option>
                                {category !== "pending" && (
                                    <option value="pendente">Pendente</option>
                                )}
                                {category !== "inProgress" && (
                                    <option value="em_progresso">Em Progresso</option>
                                )}
                                {category !== "completed" && (
                                    <option value="assistido">Assistidos</option>
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
                                    onClick={() => moveItem(selectedItem.id, selectedItem.category, selectedItem.mediaId)}
                                >
                                    Mover
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
