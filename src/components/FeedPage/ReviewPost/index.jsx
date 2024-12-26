import React, { useState, useEffect } from "react";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { getPopularMovies } from "../../../services/movieAPI";

export const ReviewPost = () => {
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedMediaId, setSelectedMediaId] = useState("");
    const [selectedMediaBanner, setSelectedMediaBanner] = useState("");
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);

    const maxChars = 2000;

    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const data = await getPopularMovies();
                setMediaList(data);
            } catch (error) {
                console.error("Erro ao buscar filmes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const handleSubmit = async () => {
        if (!reviewText || selectedRating === 0 || !selectedMediaId) {
            alert("Preencha todos os campos antes de publicar.");
            return;
        }

        const payload = {
            review: reviewText,
            spoilers: containsSpoilers,
            rating: selectedRating,
            mediaId: selectedMediaId,
        };

        console.log(payload);
        alert("Resenha publicada com sucesso!");

        setReviewText("");
        setContainsSpoilers(false);
        setSelectedRating(0);
        setSelectedMediaId("");
        setSelectedMediaBanner("");
    };

    return (
        <div className="bg-transparent-800 border-2 border-neutral-700 text-white p-2 md:p-8 rounded-lg w-[350px] md:w-[600px] lg:w-full max-w-xl md:max-w-4xl md:mx-auto mt-8 md:mt-12 flex flex-col gap-6 font-poppins md:relative transform -translate-x-[-22vw] md:translate-x-0 overflow-hidden">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <h2 className=" text-lg md:text-xl font-semibold">
                    Poste uma Nova Resenha sobre um filme ou série
                </h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm">* Contém Spoilers</label>
                    <div
                        className={`relative inline-block w-12 h-6 rounded-xl cursor-pointer ${
                            containsSpoilers ? "bg-red-500" : "bg-gray-600"
                        }`}
                        onClick={() => setContainsSpoilers(!containsSpoilers)}
                    >
                        <span
                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform ${
                                containsSpoilers ? "translate-x-6" : ""
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Corpo Principal */}
            <div className="flex flex-col lg:flex-row  gap-6 md:gap-8">
                {/* Área de Texto e Nota */}
                <div className="flex-1 flex flex-col gap-4">
                    <textarea
                        className="w-full h-52 md:h-52 p-3 md:p-4 bg-neutral-700 border-2 border-orange-500 rounded-lg resize-none focus:outline-none mb-4"
                        placeholder="Texto de resenha (máximo de 2000 caracteres)*"
                        maxLength={maxChars}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex items-center justify-center md:justify-between relative">
                        <span className="text-white text-sm absolute bottom-2 right-0">
                            {maxChars - reviewText.length}/2000
                        </span>
                        <div className="flex items-center gap-2 absolute top-2 md:top-0 md:right-2">
                            <span className="text-xs md:text-sm w-28 md:w-full">* Sua Nota:</span>
                            <input
                                type="range"
                                min={0}
                                max={5}
                                step={1}
                                value={selectedRating}
                                onChange={(e) =>
                                    setSelectedRating(parseFloat(e.target.value))
                                }
                                className="w-full md:w-32 bg-neutral70 appearance-none rounded-lg focus:outline-none"
                            />
                            <span className="text-sm">{selectedRating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Seleção de Mídia */}
                <div className="w-full lg:w-72">
                    <div
                        className={`w-full h-52 md:h-48  bg-cover bg-center rounded-xl border border-dotted border-neutral80  mt-4 md:mt-0`}
                        style={{
                            backgroundImage: `url(${
                                selectedMediaBanner
                                    ? `https://image.tmdb.org/t/p/w1280/${selectedMediaBanner}`
                                    : "/images/placeholder.png"
                            })`,
                        }}
                    ></div>
                    
                    <label
                        htmlFor="mediaSelect"
                        className="text-sm block mt-4 text-white  cursor-pointer hover:text-primary60"
                    >
                        * <span className="hover:underline">Escolha um Filme/Série</span>:
                    </label>
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <select
                            id="mediaSelect"
                            className="w-full mt-2 p-2 bg-gray-700 text-white rounded-lg text-sm md:text-base"
                            value={selectedMediaId}
                            onChange={(e) => {
                                const mediaId = e.target.value;
                                setSelectedMediaId(mediaId);
                                const selectedMedia = mediaList.find(
                                    (media) =>
                                        media.id.toString() === mediaId.toString()
                                );
                                setSelectedMediaBanner(
                                    selectedMedia?.backdrop_path || selectedMedia?.poster_path || ""
                                );
                            }}
                        >
                            <option value="">Selecione...</option>
                            {mediaList.map((media) => (
                                <option key={media.id} value={media.id}>
                                    {media.mediaType === "movie"
                                        ? `🎬 ${media.title}`
                                        : `📺 ${media.name}`}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="bg-primary50 hover:bg-primary40 text-white py-2 px-4 md:px-6 rounded-lg flex items-center lg:absolute lg:bottom-10 gap-2 self-center lg:self-start"
            >
                Publicar Resenha
                <BiMessageRoundedDetail size={28}/>
            </button>
        </div>
    );
};
