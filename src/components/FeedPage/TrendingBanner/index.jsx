import React, { useEffect, useState } from "react";
import { getTrendingMovies, getMovieTrailer } from "../../../services/movieAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";

import { AiOutlinePlayCircle } from "react-icons/ai";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Modal from "react-modal";
import { CircleSpinner } from "react-spinners-kit";

export const TrendingBanner = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [error, setError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(true);

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
            setTrailerUrl(trailer);
            setIsModalOpen(true);
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
        <div className="relative w-[65%] md:w-full h-[700px] top-10 mx-auto flex justify-center items-center text-white overflow-hidden z-20">
            {trendingMovies.length > 0 ? (
                <Swiper
                    slidesPerView={1}
                    effect={"coverflow"}
                    grabCursor={true}
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
                    className="w-full h-full"
                >
                    {trendingMovies.map(
                        (movie) =>
                            movie.overview &&
                            movie.overview.length > 0 && (
                                <SwiperSlide key={movie.id}>
                                    <div className="h-full w-full relative rounded-xl flex justify-center items-center">
                                        {!imageLoaded && (
                                            <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-10 rounded-xl">
                                                <CircleSpinner
                                                    size={50}
                                                    color="#ffffff"
                                                />
                                            </div>
                                        )}
                                        <img
                                            src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
                                            alt={
                                                movie.title ||
                                                "Imagem não disponível"
                                            }
                                            onLoad={() => setImageLoaded(true)}
                                            onError={() => setImageLoaded(true)}
                                            className="hidden" 
                                        />
                                        <div
                                            className={`h-full w-full bg-cover bg-center bg-no-repeat relative rounded-xl transition-opacity duration-500 ${
                                                imageLoaded
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                            style={{
                                                backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

                                            <div className="absolute bottom-0 left-0 w-auto p-0">
                                                <div className="relative bg-gradient-to-r from-black/80 to-transparent bg-opacity-40 backdrop-blur-sm p-6 rounded-r-xl max-w-2xl mx-auto">
                                                    <h1 className="text-3xl md:text-6xl font-light text-white font-moonjelly mb-4 md:mb-8">
                                                        {movie.title ||
                                                            movie.name ||
                                                            "Título não disponível"}
                                                    </h1>
                                                    <p className="text-sm md:text-md text-gray-200 mb-4 md:mb-6 font-poppins">
                                                        {movie.overview.length >
                                                        200
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
                    <button className="custom-prev absolute bottom-0 right-20 transform -translate-y-1/2 bg-primary60 text-white p-2 rounded-full shadow-lg hover:bg-primary40 transition z-50">
                        <FaArrowLeft size={24} />
                    </button>
                    <button className="custom-next absolute bottom-0 right-4 transform -translate-y-1/2 bg-primary60 text-white p-2 rounded-full shadow-lg hover:bg-primary40 transition z-50">
                        <FaArrowRight size={24} />
                    </button>
                </Swiper>
            ) : (
                <div className="text-white">
                    Nenhum Filme em tendência encontrado.
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Trailer Modal"
                className="modal-contentrelative bg-black rounded-lg shadow-lg p-2"
                overlayClassName="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                style={{
                    overlay: {
                        zIndex: 2001,
                    },
                }}
            >
                {trailerUrl ? (
                    <div className="relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-[-15px] right-[-15px] bg-red-600 text-white text-2xl w-10 h-10 flex justify-center items-center rounded-full shadow-lg hover:bg-red-700 transition duration-200"
                        >
                            X
                        </button>
                        <iframe
                            width="500"
                            height="415"
                            src={trailerUrl}
                            title="Trailer"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-md"
                        ></iframe>
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
    );
};
