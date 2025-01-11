// Importando os componentes do react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

// Dados iniciais de exemplo
const initialWatchList = {
    pending: [
        { id: "823219", media_type: "movie", title: "Movie 1", poster: "https://placehold.co/200x200/png" },
        { id: "93405", media_type: "tv", title: "TV Show 1", poster: "https://placehold.co/200x200/png" },
        { id: "402431", media_type: "movie", title: "Movie 2", poster: "https://placehold.co/200x200/png" },
    ],
    inProgress: [
        { id: "426063", media_type: "movie", title: "Movie 3", poster: "https://placehold.co/200x200/png" },
    ],
    completed: [
        { id: "279283", media_type: "tv", title: "TV Show 2", poster: "https://placehold.co/200x200/png" },
        { id: "929204", media_type: "movie", title: "Movie 4", poster: "https://placehold.co/200x200/png" },
    ],
};

export const WatchList = () => {
    const [watchList, setWatchList] = useState(initialWatchList);

    // Função para lidar com o drag and drop
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Verifica se o item foi solto em uma área válida
        if (!destination) return;

        // Verifica se o item foi solto na mesma posição
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Clona os itens da origem
        const sourceItems = Array.from(watchList[source.droppableId]);
        const [movedItem] = sourceItems.splice(source.index, 1);

        // Clona os itens do destino e adiciona o item movido
        const destinationItems = Array.from(watchList[destination.droppableId]);
        destinationItems.splice(destination.index, 0, movedItem);

        // Atualiza o estado com a nova lista
        setWatchList((prev) => ({
            ...prev,
            [source.droppableId]: sourceItems,
            [destination.droppableId]: destinationItems,
        }));
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="watchlist-container text-neutral10 flex justify-center">
                {/* Seção Pendente */}
                <Droppable droppableId="pending">
                    {(provided) => (
                        <div
                            className="watchlist-section"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <h2>Pendente</h2>
                            {watchList.pending.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            className="mini-banner"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <img
                                                src={item.poster}
                                                alt={item.title}
                                            />
                                            <span>{item.title}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Seção Em Progresso */}
                <Droppable droppableId="inProgress">
                    {(provided) => (
                        <div
                            className="watchlist-section"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <h2>Em Progresso</h2>
                            {watchList.inProgress.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            className="mini-banner"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <img
                                                src={item.poster}
                                                alt={item.title}
                                            />
                                            <span>{item.title}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Seção Assistidos */}
                <Droppable droppableId="completed">
                    {(provided) => (
                        <div
                            className="watchlist-section"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <h2>Assistidos</h2>
                            {watchList.completed.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            className="mini-banner"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <img
                                                src={item.poster}
                                                alt={item.title}
                                            />
                                            <span>{item.title}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};
