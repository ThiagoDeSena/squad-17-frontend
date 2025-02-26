import React, { useEffect, useState } from "react";
import { getMediaMoreDetails } from "../../../services/movieAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReviewContainer } from "../../FeedPage/Feed/ReviewContainer";
import "swiper/css";
import { FiCalendar, FiFilm, FiClock, FiChevronDown } from "react-icons/fi";
import { LuClapperboard } from "react-icons/lu";
import { MdLanguage, MdTv, MdTheaterComedy } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { MdEmojiFlags } from "react-icons/md";
import { RiMovie2Fill } from "react-icons/ri";
import { Recomended } from "../../FeedPage/Recomended";
import { ReviewPost } from "../../FeedPage/ReviewPost";
import { getReviewByMedia } from "../../../services/review";

export const MediaDetails = ({ mediaType, mediaId }) => {
    const [mediaData, setMediaData] = useState(null);
    const [activeTab, setActiveTab] = useState("information");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [moreGenresVisible, setMoreGenresVisible] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isPost, setIsPost] = useState(false);
    const handleSelectLanguage = (language) => {
        setSelectedLanguage(language);
        setIsOpen(false);
    };
    localStorage.setItem("lastMedia", JSON.stringify({ type: mediaType, id: mediaId }));

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getReviewByMedia(mediaId, mediaType);
                setReviews(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReviews();
    }, [isPost]);

    useEffect(() => {
        const fetchSeriesData = async () => {
            try {
                const data = await getMediaMoreDetails(mediaType, mediaId);
                if (data) {
                    setMediaData(data);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchSeriesData();
    }, [mediaType, mediaId]);

    if (!mediaData) {
        return <div>Loading...</div>;
    }

    const { credits = {}, details = {} } = mediaData;
    details.media_type = mediaType;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    return (
        <div className="relative left-[6%] lg:left-0 mx-auto w-[85%] md:w-full max-w-4xl xl:max-w-6xl xl:left-12 bg-neutral90 h-auto rounded-[15px] overflow-hidden mt-12 font-poppins p-4 sm:p-6">
            <div className="flex justify-center space-x-2 sm:space-x-4 border-b border-gray-700 pb-2">
                <button
                    className={`${
                        activeTab === "information"
                            ? "text-primary70 border-b-4 border-primary90 rounded-md"
                            : "text-gray-400"
                    } text-sm sm:text-base`}
                    onClick={() => handleTabChange("information")}
                >
                    Informações
                </button>
                <button
                    className={`${
                        activeTab === "reviews"
                            ? "text-primary80 border-b-4 border-primary90 rounded-md"
                            : "text-gray-400"
                    } text-sm sm:text-base`}
                    onClick={() => handleTabChange("reviews")}
                >
                    Avaliações
                </button>
            </div>

            {activeTab === "information" && (
                <div className="mt-4 text-neutral10">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">Detalhes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-20">
                        <div>
                            <p className="border-b border-t border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                <span className="flex items-center">
                                    <MdEmojiFlags className="mr-2 text-primary40" size={25} />
                                    <strong>País de Origem:</strong>
                                </span>
                                <span>{details.origin_country || "N/A"}</span>
                            </p>
                            <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                <span className="flex items-center">
                                    <FiCalendar size={25} className="mr-2 text-primary40" />
                                    <strong>Data de Lançamento:</strong>
                                </span>
                                <span>
                                    {details.first_air_date || details.release_date
                                        ? new Date(details.first_air_date || details.release_date).getFullYear()
                                        : "N/A"}
                                </span>
                            </p>

                            <div className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base relative">
                                <span className="flex items-center">
                                    <MdLanguage size={25} className="mr-2 text-primary40" />
                                    <strong>Idioma:</strong>
                                </span>
                                <div className="relative">
                                    <button
                                        className="bg-transparent text-neutral10 border border-neutral60 rounded-md py-1 px-3 flex items-center justify-between w-full hover:border-primary40 focus:outline-none"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        {details.spoken_languages && details.spoken_languages.length > 0
                                            ? selectedLanguage || details.spoken_languages[0].english_name
                                            : "N/A"}
                                        <FiChevronDown
                                            size={20}
                                            className={`ml-2 transform transition-transform ${
                                                isOpen ? "rotate-180" : ""
                                            } text-neutral60`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <ul className="absolute z-10 mt-2 w-full bg-neutral90 rounded-md shadow-lg border border-neutral60">
                                            {details.spoken_languages && details.spoken_languages.length > 0 ? (
                                                details.spoken_languages.map((lang) => (
                                                    <li
                                                        key={lang.iso_639_1}
                                                        onClick={() => handleSelectLanguage(lang.english_name)}
                                                        className="px-3 py-2 hover:bg-primary30 hover:text-neutral10 cursor-pointer"
                                                    >
                                                        {lang.english_name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-3 py-2 text-neutral60">Nenhum idioma disponível</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {details.networks && (
                                <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                    <span className="flex items-center">
                                        <MdTv size={25} className="mr-2 text-primary40" />
                                        <strong>Onde assitir:</strong>
                                    </span>
                                    <div className="flex flex-wrap">
                                        {details.networks && details.networks.length > 0
                                            ? details.networks.map((i) => (
                                                  <span
                                                      key={i.name}
                                                      className="inline-flex items-center bg-neutral10 p-2 rounded-xl mr-2 mb-2"
                                                  >
                                                      {i.logo_path && (
                                                          <img
                                                              src={`https://image.tmdb.org/t/p/w45${i.logo_path}`}
                                                              alt={`${i.name} logo`}
                                                              className="max-w-[50px]"
                                                          />
                                                      )}
                                                  </span>
                                              ))
                                            : "N/A"}
                                    </div>
                                </p>
                            )}
                        </div>
                        <div>
                            {credits.crew &&
                                credits.crew.some(({ department }) =>
                                    ["Directing", "Writing"].includes(department)
                                ) && (
                                    <p className="border-b border-t border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                        <span className="flex items-center">
                                            <MdTheaterComedy size={25} className="mr-2 text-primary40" />
                                            <strong>Diretor/Roteirista:</strong>
                                        </span>
                                        <span>
                                            {credits.crew
                                                .filter(({ department }) =>
                                                    ["Directing", "Writing"].includes(department)
                                                )
                                                .slice(0, 1)
                                                .map(({ name }) => name)
                                                .join(", ") || "N/A"}
                                            {" ..."}
                                        </span>
                                    </p>
                                )}
                            {details.created_by && details.created_by.length > 0 && (
                                <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                    <span className="flex items-center">
                                        <LuClapperboard size={25} className="mr-2 text-primary40" />
                                        <strong>Criado por:</strong>
                                    </span>
                                    <span>{details.created_by[0].name}</span>
                                </p>
                            )}
                            {details.runtime && (
                                <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                    <span className="flex items-center">
                                        <FiClock size={25} className="mr-2 text-primary40" />
                                        <strong>Duração:</strong>
                                    </span>
                                    <span>
                                        {`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` || "N/A"}
                                    </span>
                                </p>
                            )}
                            {details.number_of_seasons && (
                                <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                    <span className="flex items-center">
                                        <FiFilm size={25} className="mr-2 text-primary40" />
                                        <strong>Nº de Temporadas:</strong>
                                    </span>
                                    <span>{details.number_of_seasons || "N/A"}</span>
                                </p>
                            )}
                            {details.number_of_episodes && (
                                <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                    <span className="flex items-center">
                                        <RiMovie2Fill size={25} className="mr-2 text-primary40" />
                                        <strong>Nº de Episódios:</strong>
                                    </span>
                                    <span>{details.number_of_episodes || "N/A"}</span>
                                </p>
                            )}
                            {details.genres && (
                                <p className="border-b border-neutral60 p-2 flex justify-between items-center text-sm sm:text-base">
                                    <span className="flex items-center">
                                        <MdEmergency size={25} className="mr-2 text-primary40" />
                                        <strong>Gêneros:</strong>
                                    </span>
                                    <span>
                                        {details.genres.length > 0 ? (
                                            <>
                                                {details.genres
                                                    .slice(0, 3)
                                                    .map((genre) => genre.name)
                                                    .join(", ")}
                                                {details.genres.length > 3 && (
                                                    <button
                                                        onClick={() => setMoreGenresVisible(!moreGenresVisible)}
                                                        className="text-primary40 ml-2"
                                                    >
                                                        {moreGenresVisible ? "-" : "+"}
                                                    </button>
                                                )}
                                                {moreGenresVisible && (
                                                    <div className="mt-2">
                                                        {details.genres.slice(3).map((genre) => (
                                                            <span key={genre.id} className="mr-2">
                                                                {genre.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            "N/A"
                                        )}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold mt-6 mb-4">Elenco</h2>
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={5}
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                                centeredSlides: true,
                            },
                            640: { slidesPerView: 2, centeredSlides: true },
                            768: { slidesPerView: 2, centeredSlides: true },
                            1024: { slidesPerView: 4, centeredSlides: false },
                            1280: { slidesPerView: 5, centeredSlides: false },
                            1440: { slidesPerView: 6, centeredSlides: false },
                        }}
                        loop={false}
                        className="w-full"
                    >
                        {credits.cast &&
                            credits.cast.map(
                                (actor, index) =>
                                    actor.profile_path &&
                                    actor.character && (
                                        <SwiperSlide
                                            key={index}
                                            className="flex flex-col items-center justify-center p-2 sm:p-4"
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 border-primary40 mb-2 mx-auto"
                                            />
                                            <p className="text-xs sm:text-sm font-semibold text-center text-white">
                                                {actor.character}
                                            </p>
                                            <p className="text-xs text-center text-neutral40 mt-1">{actor.name}</p>
                                        </SwiperSlide>
                                    )
                            )}
                    </Swiper>
                    <Recomended
                        title={
                            <span>
                                Similares a{" "}
                                <strong className="text-primary40 underline">
                                    {details.original_title || details.name}
                                </strong>
                            </span>
                        }
                        viewMore={false}
                    />
                </div>
            )}

            {activeTab === "reviews" && (
                <div className="mt-1">
                    <h2 className="text-base text-center sm:text-lg md:text-left font-semibold text-neutral10">
                        Avaliações
                    </h2>
                    <div className="mb-8 relative right-[20vw] md:left-0">
                        <ReviewPost
                            unique={true}
                            uniqueTitle={details.original_title || details.name}
                            uniqueMedia={details}
                            setIsPost={setIsPost}
                        />
                    </div>

                    {reviews && reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <ReviewContainer
                                key={review.id}
                                reviewId={review.id}
                                movieId={review.mediaId}
                                plataform={review.mediaType}
                                profileId={review.userId}
                                selfProfile={review.isUser}
                            />
                        ))
                    ) : (
                        <div className="w-full flex flex-col justify-center items-center">
                            <img src="/images/no-content.svg" alt="No Content" width={400} />
                            <p className="text-neutral40">Nenhuma avaliação encontrada</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
