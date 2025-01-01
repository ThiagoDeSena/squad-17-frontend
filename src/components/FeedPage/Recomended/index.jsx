import { useEffect, useState } from "react";
import { RecomendedCard } from "./RecomendedCard";
import { getSimilarMedia } from "../../../services/movieAPI";
import { FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";


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


export const Recomended = ({mt, title, viewMore}) => {
    const [recomended, setRecomended] = useState([]);
    const lastMedia = JSON.parse(localStorage.getItem("lastMedia")) || {type: 'tv', id: 63174};

    useEffect(() => {
        const fetchRecomended = async () => {
            try {
                const movies = await getSimilarMedia(lastMedia.type, lastMedia.id);
                setRecomended(movies);
            } catch (error) {
                console.error("Erro ao carregar filmes em tendência: ", error);
            }
        };

        fetchRecomended();
    }, []);

    return (
        <div className={`${mt} px-4 flex items-center justify-center`}>
            <div className="max-w-[1200px] w-full mx-auto">
                <div className="flex flex-col md:flex-row justify-center items-center mb-2 text-center font-moonjelly">
                    <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-white md:mb-0">
                        {title}
                    </h2>
                    {viewMore && <button className="text-lg md:text-2xl flex items-center justify-center text-primary60 hover:text-primary40 transition hover:underline md:ml-4">
                        Ver mais
                        <FaArrowRight className="ml-2" />
                    </button>}
                </div>
                <Swiper
                    spaceBetween={0}
                    slidesPerView={3}
                    centeredSlides={false}
                    loop={true}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 20, centeredSlides: true },
                        640: { slidesPerView: 2, centeredSlides: true },
                        768: { slidesPerView: 2, centeredSlides: true },
                        1024: { slidesPerView: 3, centeredSlides: true },
                        1280: { slidesPerView: 4, centeredSlides: true },
                        1440: { slidesPerView: 5, centeredSlides: false },
                    }}
                    className="flex gap-2 justify-center items-center no-scrollbar mt-8"
                >
                    {recomended.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <RecomendedCard
                                image={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
                                title={
                                    movie.title ||
                                    movie.name ||
                                    "Título não disponível"
                                }
                                genre={movie.genre_ids
                                    .map((id) => genres[id] || genres.default)
                                    .join(", ")}
                                onAddToWatchlist={() =>
                                    console.log(
                                        `Adicionado  Watchlist: ${movie.title || movie.name}`
                                    )
                                }
                                className={`relative w-48 h-72 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-90 font-poppins`}
                                id={movie.id}
                                type={movie.media_type}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};
