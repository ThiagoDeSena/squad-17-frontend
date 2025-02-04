import React, { useEffect, useState } from "react";
import { getTrendingMovies, getMovieTrailer } from "../../../services/movieAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Modal from "react-modal";
import { CircleSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router-dom";

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

export const TrendingBanner = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [error, setError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(true);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const movies = await getTrendingMovies();
                setTrendingMovies(movies);
            } catch (error) {
                console.error("Erro ao carregar filmes em tendência: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingMovies();
    }, []);

    const openTrailerModal = async (mediaType, movieId) => {
        try {
            setError(false);
            setTrailerUrl("");
            const trailer = await getMovieTrailer(mediaType, movieId);

            if (trailer) {
                setTrailerUrl(trailer);
                setIsModalOpen(true);
            } else {
                setError(true);
                setTrailerUrl("");
            }
        } catch (error) {
            console.error("Erro ao carregar trailer:", error);
            setError(true);
            setTrailerUrl("");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTrailerUrl("");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <CircleSpinner size={40} color="#fff" />
            </div>
        );
    }

    return (
        <>
            <div className="w-full text-center  flex items-center justify-center space-x-4 absolute z-50 top-2 font-moonjelly">
                <h2 className="text-2xl md:text-4xl font-bold text-primary60 uppercase tracking-widest">
                    <span className="text-white">🔥</span> Em Alta
                </h2>
            </div>
            <div className="relative w-[65%] md:w-full h-[700px] top-10 mx-auto flex justify-center items-center text-white overflow-hidden z-20">
                {trendingMovies.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        effect={"coverflow"}
                        grabCursor={true}
                        loop={true}
                        onAutoplay={true}
                        centeredSlides={true}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 2 },
                        }}
                        navigation={{
                            nextEl: ".custom-next",
                            prevEl: ".custom-prev",
                        }}
                        modules={[EffectCoverflow, Navigation]}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        className="w-full h-full mt-4"
                    >
                        {trendingMovies.map(
                            (movie) =>
                                movie.overview &&
                                movie.overview.length > 0 && (
                                    <SwiperSlide key={movie.id}>
                                        <div className="h-full w-full rounded-xl flex justify-center items-center">
                                            {!imageLoaded && (
                                                <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-10 rounded-xl">
                                                    <CircleSpinner
                                                        size={50}
                                                        color="#F9370B"
                                                    />
                                                </div>
                                            )}
                                            <div
                                                className={`h-full w-full bg-cover bg-center bg-no-repeat relative rounded-xl transition-opacity duration-500 ${
                                                    imageLoaded
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                                style={{
                                                    backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})`,
                                                }}
                                                onLoad={() =>
                                                    setImageLoaded(true)
                                                }
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

                                                <div className="absolute bottom-0 left-0 w-auto p-0">
                                                    <div className="relative bg-gradient-to-r from-black/80 to-transparent bg-opacity-40 backdrop-blur-sm p-6 rounded-r-xl max-w-2xl mx-auto">
                                                        <h1
                                                            className="text-3xl md:text-6xl font-light text-white font-moonjelly mb-4 md:mb-8 hover:underline cursor-pointer"
                                                            onClick={() => {
                                                                navigate(
                                                                    `/media/${movie.media_type}/${movie.id}`
                                                                );
                                                            }}
                                                        >
                                                            {movie.title ||
                                                                movie.name ||
                                                                "Título não disponível"}
                                                        </h1>
                                                        <div className="text-sm md:text-md text-white mb-4 md:mb-6 font-poppins">
                                                            {movie.genre_ids
                                                                .map(
                                                                    (genre) =>
                                                                        genres[
                                                                            genre
                                                                        ] ||
                                                                        genres.default
                                                                )
                                                                .map(
                                                                    (
                                                                        genre,
                                                                        index,
                                                                        arr
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                genre
                                                                            }
                                                                            {index <
                                                                                arr.length -
                                                                                    1 && (
                                                                                <span className="text-primary60 mx-1">
                                                                                    |
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    )
                                                                )}
                                                        </div>

                                                        <p className="text-sm md:text-md text-gray-200 mb-4 md:mb-6 font-poppins">
                                                            {movie.overview
                                                                .length > 200
                                                                ? `${movie.overview.substring(
                                                                      0,
                                                                      200
                                                                  )}...`
                                                                : movie.overview}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setIsModalOpen(
                                                                    true
                                                                );
                                                                openTrailerModal(
                                                                    movie.media_type,
                                                                    movie.id
                                                                );
                                                            }}
                                                            className="bg-primary60 text-neutral10 py-2 px-4 rounded-full text-sm md:text-lg flex items-center justify-center uppercase"
                                                        >
                                                            <AiOutlinePlayCircle
                                                                size={20}
                                                                className="mr-2"
                                                            />
                                                            Trailer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                        )}
                        <button className="custom-prev absolute bottom-0 right-20 transform -translate-y-1/2 bg-primary60 text-white p-2 rounded-full shadow-lg hover:bg-primary40 transition z-50 hidden md:hidden sm:block">
                            <FaArrowLeft size={24} />
                        </button>
                        <button className="custom-next absolute bottom-0 right-4 transform -translate-y-1/2 bg-primary60 text-white p-2 rounded-full shadow-lg hover:bg-primary40 transition z-50 hidden md:hidden sm:block">
                            <FaArrowRight size={24} />
                        </button>
                    </Swiper>
                ) : (
                    <div className="text-white">
                        <p className="text-white flex flex-col justify-center items-center gap-4">
                            <img
                                src="/images/asking-question.svg"
                                height={300}
                                width={300}
                                alt=""
                            />
                            Nenhum Filme em tendência encontrado.
                        </p>
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Trailer Modal"
                    className="modal-content relative bg-black rounded-lg shadow-lg p-2"
                    overlayClassName="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                    style={{
                        overlay: {
                            zIndex: 2001,
                        },
                    }}
                >
                    {trailerUrl ? (
                        <div className="relative h-[350px] md:h-[60vh] w-[450px] md:w-[60vw] mx-auto p-2">
                            <button
                                onClick={closeModal}
                                className="absolute top-[-15px] right-[-15px] bg-red-600 text-white text-2xl w-10 h-10 flex justify-center items-center rounded-full shadow-lg hover:bg-red-700 transition duration-200"
                            >
                                <IoCloseCircleOutline size={44} />
                            </button>
                            {trailerUrl !== "timeout" ? (
                                <iframe
                                    src={trailerUrl}
                                    width={"100%"}
                                    height={"100%"}
                                    title="Trailer"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-md"
                                ></iframe>
                            ) : (
                                <div className="text-white text-center">
                                    O trailer demorou muito para carregar.
                                </div>
                            )}
                        </div>
                    ) : error ? (
                        <div className="text-white text-center">
                            Trailer não encontrado.
                        </div>
                    ) : (
                        <div className="text-white text-center">
                            <CircleSpinner size={40} color="#fff" />
                        </div>
                    )}
                </Modal>
            </div>
        </>
    );
};
