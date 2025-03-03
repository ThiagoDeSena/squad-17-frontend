import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { WatchCard } from "./WatchCard";
import { FiArrowUpRight, FiBookmark, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { categoryMoved, getWatchList, removeToWatchlist } from "../../api/watchListApi";
import { AlertWindow } from "../Utils/AlertWindow";

export const WatchList = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
    const [watchList, setWatchList] = useState([]);
    const [isRemove, setIsRemove] = useState(false);
    const [isMoved, setIsMoved] = useState(false);
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const statuses = ["pendente", "em_progresso", "assistido"];
                let newWatchList = {
                    pending: [],
                    inProgress: [],
                    completed: [],
                };
                for (let status of statuses) {
                    const response = await getWatchList(status, 0, 5);
                    const { content } = response;
    
                    for (let id in content) {
                        const item = content[id];
                        const statusMap = {
                            pendente: "pending",
                            em_progresso: "inProgress",
                            assistido: "completed",
                        };
                        const category = statusMap[item.mediaStatus];
    
                        if (category) {
                            newWatchList[category].push(item);
                        }
                    }
                }
                setWatchList(newWatchList);
            } catch (error) {
                console.error(error);
            }
        }
        fetchWatchlist()
    }, [isRemove, isMoved])


    const handleDragStart = () => {
        setIsDraggingDisabled(true);
    }
    const handleDragEnd = async (result) => {
        setIsDraggingDisabled(true)
        const { source, destination } = result;
        if (!destination) {
            setIsDraggingDisabled(false)
            return
        };
        if (source.droppableId === destination.droppableId && source.index === destination.index
        ) {
            setIsDraggingDisabled(false);
            return;
        }
        const sourceCategory = source.droppableId;
        const destinationCategory = destination.droppableId;



        if (sourceCategory === destinationCategory) {
            const updatedItems = [...watchList[sourceCategory]];
            const [movedItem] = updatedItems.splice(source.index, 1)
            updatedItems.splice(destination.index, 0, movedItem);
            setWatchList((prev) => ({
                ...prev,
                [sourceCategory]: updatedItems,
            }));
        } else {
            const sourceItems = [...watchList[sourceCategory]];
            const destinationItems = [...watchList[destinationCategory]];
            const [movedItem] = sourceItems.splice(source.index, 1);
            destinationItems.splice(destination.index, 0, movedItem);

            setWatchList((prev) => ({
                ...prev,
                [sourceCategory]: sourceItems,
                [destinationCategory]: destinationItems
            }))
        }
        setIsMoved(false);
        try {
            const newStatus = destinationCategory === "pending" ? "pendente" :
                destinationCategory === "inProgress" ? "em_progresso" :
                    "assistido";
            const response = await categoryMoved(result.draggableId, newStatus);
            setIsMoved(true);
        } catch (error) {
            console.error("Erro ao atualizar a lista na API", error);
        }
        setTimeout(() => {
            setIsDraggingDisabled(false);
        }, 1000)
    };

    const handleRemove = async (id, mediaType) => {
        try {
            await removeToWatchlist(id, mediaType);
            setIsRemove((prev) => !prev);
        } catch (error) {
            console.error("Erro ao remover da Watchlist:", error);
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
            <div
                className="watchlist-page flex flex-col items-center p-8 bg-neutral90 overflow-auto lg:overflow-hidden h-screen"
                style={{ userSelect: "none" }}
            >
                <div className="page-header flex items-center gap-2 mb-8">
                    <h1 className="text-6xl font-semibold text-neutral10 font-moonjelly flex gap-2 items-center text-center w-full">
                        Watchlist
                        <FiBookmark size={38} className="text-primary40" />
                    </h1>
                </div>
                {!Object.values(watchList).some((list) => list.length > 0) && (
                    <div className="text-center text-neutral10 flex flex-col justify-center items-center">
                        <img
                            src="/images/spot.svg"
                            alt="Lista vazia"
                            className="mx-auto mt-4 w-40 md:w-80"
                        />
                        <p>Lista vazia</p>
                    </div>
                )}

                {Object.values(watchList).some((list) => list.length > 0) && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="watchlist-container flex flex-wrap justify-center gap-10 md:overflow-hidden h-full w-full">
                            {/* Seção Pendente */}
                            <Droppable droppableId="pending" direction="vertical">
                                {(provided) => (
                                    <div
                                        className="p-4 rounded-lg shadow-md w-full md:w-64 relative bg-gradient-to-t from-blue-500/30 to-transparent flex flex-col h-full mx-auto md:mx-0 left-8 md:left-0"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="flex justify-between flex-col items-end mb-4 backdrop-blur-md">
                                            <h2
                                                className="text-3xl font-moonjelly text-neutral10 font-bold w-full z-10 flex items-center justify-end hover:underline hover:cursor-pointer hover:text-primary50"
                                                onClick={() =>
                                                    navigate("/watchlist/pending")
                                                }
                                            >
                                                Pendente
                                                {provided.placeholder && (
                                                    <FiArrowUpRight />
                                                )}
                                            </h2>
                                            {watchList.pending && watchList.pending.length > 0 && (
                                                <p className="text-neutral10 flex justify-end">
                                                    {watchList.pending.length}
                                                </p>
                                            )}
                                        </div>
                                        <div className="overflow-y-auto h-full p-2">
                                            {!watchList.pending || watchList.pending.length === 0 ? (
                                                <div className="text-center text-neutral10 flex flex-col justify-center items-center">
                                                    <img
                                                        src="/images/spot.svg"
                                                        alt="Lista vazia"
                                                        className="mx-auto mt-4 w-40"
                                                    />
                                                    <p>Lista vazia</p>
                                                </div>
                                            ) : (
                                                watchList.pending.map((item, index) => (
                                                    <Draggable
                                                        key={item.id.toString()}
                                                        draggableId={item.id.toString()}
                                                        index={index}
                                                        isDragDisabled={isDraggingDisabled}
                                                    >
                                                        {(provided) => (
                                                            <WatchCard
                                                                mediaType={item.mediaType}
                                                                id={item.mediaId}
                                                                ref={provided.innerRef}
                                                                className={"relative w-38 md:h-72 h-[500px] rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-90 font-poppins mb-4 ease-linear duration-300"}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onRemove={handleRemove}
                                                            />
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}

                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>

                            {/* Seção Em Progresso */}
                            <Droppable droppableId="inProgress">
                                {(provided) => (
                                    <div
                                        className="p-4 rounded-lg shadow-md w-full md:w-64 relative bg-gradient-to-t from-yellow-500/30 to-transparent flex flex-col h-full left-8 md:left-0"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="flex justify-between flex-col items-end mb-4">
                                            <h2
                                                className="text-3xl font-moonjelly text-neutral10 font-bold w-full backdrop-blur-md z-10 flex items-center
                                    justify-end hover:underline hover:cursor-pointer hover:text-primary50"
                                                onClick={() => navigate("/watchlist/inProgress")}
                                            >
                                                Em Progresso
                                                <FiArrowUpRight />
                                            </h2>
                                            {watchList.inProgress && watchList.inProgress.length > 0 && (
                                                <p className="text-neutral10 justify-start">
                                                    {watchList.inProgress.length}
                                                </p>
                                            )}
                                        </div>
                                        <div className="overflow-y-auto h-full">
                                            {watchList.inProgress && watchList.inProgress.length === 0 ? (
                                                <div className="text-center text-neutral10 flex flex-col justify-center items-center">
                                                    <img
                                                        src="/images/spot.svg"
                                                        alt="Lista vazia"
                                                        className="mx-auto mt-4 w-40"
                                                    />
                                                    <p>Lista vazia</p>
                                                </div>
                                            ) : (
                                                watchList.inProgress && watchList.inProgress.map(
                                                    (item, index) => (
                                                        <Draggable
                                                            key={item.id.toString()}
                                                            draggableId={item.id.toString()}
                                                            index={index}
                                                            isDragDisabled={isDraggingDisabled}
                                                        >
                                                            {(provided) => (
                                                                <WatchCard
                                                                    mediaType={item.mediaType}
                                                                    id={item.mediaId}
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    className={"relative w-38 md:h-72 h-[500px] rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-90 font-poppins mb-4 ease-linear duration-300"}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onRemove={handleRemove}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    )
                                                )
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>

                            {/* Seção Assistidos */}
                            <Droppable droppableId="completed">
                                {(provided) => (
                                    <div
                                        className="p-4 rounded-lg shadow-md w-full md:w-64 relative bg-gradient-to-t from-green-500/30 to-transparent flex flex-col h-full left-8 md:left-0"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="flex justify-between flex-col items-end mb-4 backdrop-blur-md">
                                            <h2 className="text-3xl font-moonjelly text-neutral10 font-bold w-full z-10 flex items-center hover:underline  justify-end hover:cursor-pointer hover:text-primary50"
                                                onClick={() => navigate("/watchlist/completed")}>
                                                Assistidos
                                                {provided.placeholder && (
                                                    <FiArrowUpRight />
                                                )}
                                            </h2>
                                            {watchList.completed && watchList.completed.length > 0 && (
                                                <p className="text-neutral10 justify-start">
                                                    {watchList.completed.length}
                                                </p>
                                            )}
                                        </div>
                                        <div className="overflow-y-auto h-full">
                                            {watchList.completed && watchList.completed.length === 0 ? (
                                                <div className="text-center text-neutral10 flex flex-col justify-center items-center">
                                                    <img
                                                        src="/images/spot.svg"
                                                        alt="Lista vazia"
                                                        className="mx-auto mt-4 w-40"
                                                    />
                                                    <p>Lista vazia</p>
                                                </div>
                                            ) : (
                                                watchList.completed && watchList.completed.map(
                                                    (item, index) => (
                                                        <Draggable
                                                            key={item.id.toString()}
                                                            draggableId={item.id.toString()}
                                                            index={index}
                                                            isDragDisabled={isDraggingDisabled}
                                                        >
                                                            {(provided) => (
                                                                <WatchCard
                                                                    mediaType={item.mediaType}
                                                                    id={item.mediaId}
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    className={"relative w-38 md:h-72 h-[500px] rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-90 font-poppins mb-4 ease-linear duration-300"}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onRemove={handleRemove}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    )
                                                )
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
                )}
            </div>
        </>
    );
};
