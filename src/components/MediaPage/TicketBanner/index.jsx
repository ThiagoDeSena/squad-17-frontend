import React, { useState, useEffect } from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { getMediaDetails, getMovieTrailer } from "../../../api/movieAPI";
import { addToWatchList, isToTheWatchList, removeToWatchlist } from "../../../api/watchlistApi";
import { CircleSpinner, RotateSpinner } from "react-spinners-kit";
import { FaBookmark, FaRegStar, FaStar } from "react-icons/fa";
import Modal from "react-modal";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { notaGeral } from "../../../api/review";

Modal.setAppElement("#root");

export const TicketBanner = ({ mediaType, mediaId }) => {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [error, setError] = useState(false);
  const [inWatchlist, setInWatchList] = useState(false);
  const [notaMedia, setNotaMedia] = useState(0);
  const navigate = useNavigate();



  useEffect(() => {
    setLoading(true);
    const fetchMediaDetails = async () => {
      try {
        const [data, trailerUrl, notaGeralResponse] = await Promise.all([
          getMediaDetails(mediaType, mediaId),
          getMovieTrailer(mediaType, mediaId),
          notaGeral(mediaId, mediaType),
        ]);
        setMediaDetails(data);

        setNotaMedia(notaGeralResponse);
        if (trailerUrl) {
          setTrailer(trailerUrl);
        } else {
          setError(true);
          setTrailer("");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da media:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkWatchlist = async () => {
      try {
        const response = await isToTheWatchList(mediaId, mediaType);
        setInWatchList(!!response);
      } catch (error) {
        console.error(error);
      }
    };

    checkWatchlist();
    fetchMediaDetails();
  }, [mediaType, mediaId], []);

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    try {
      if (inWatchlist) {
        const response = await removeToWatchlist(mediaId, mediaType);
        if (response === 204) setInWatchList(false);
      } else {
        const response = await addToWatchList(mediaId, mediaType);
        if (response) setInWatchList(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar watchlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center w-full h-full bg-neutral90 bg-opacity-50 z-50 text-center">
        <RotateSpinner size={50} color="#F9370B" />
        <p className="text-white mt-4">Carregando informações...</p>
      </div>
    );
  }

  if (!mediaDetails) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-neutral90 bg-opacity-50 z-10 text-center">
        <p className="text-white flex flex-col justify-center items-center gap-4">
          <img src="/images/asking-question.svg" height={300} width={300} alt="" />
          Erro ao carregar os dados da mídia.
          <button
            onClick={() => navigate("/")}
            className="bg-primary30 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary60 transition duration-300"
          >
            Voltar
          </button>
        </p>
      </div>
    );
  }

  const {
    poster_path,
    backdrop_path,
    title,
    name,
    overview,
    genres,
    runtime,
    number_of_seasons,
    vote_average,
    tagline,
  } = mediaDetails;

  const mediaTitle = title || name || "Title Not Available";
  const mediaGenres = genres?.map((genre) => genre.name).join(", ") || "Unknown";
  const mediaRuntime = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : `${number_of_seasons} seasons`;

  const releaseYear = mediaDetails.release_date
    ? mediaDetails.release_date.slice(0, 4)
    : mediaDetails.first_air_date
    ? mediaDetails.first_air_date.slice(0, 4)
    : mediaDetails.realesed_date
    ? mediaDetails.realesed_date.slice(0, 4)
    : "";
  const closeModal = () => {
    setTrailerModalOpen(false);
  };

  return (
    <div className="relative w-[100%] max-w-6xl mx-auto flex flex-col md:flex-row items-stretch h-auto rounded-[15px] overflow-hidden left-12 font-poppins">
      {/* Lateral direita */}
      <div className="absolute bg-[#191919] rounded-full w-[98.794px] h-[118.084px] top-[-60px] left-[-46px] border-r-4 border-neutral30 "></div>
      <div className="absolute bg-[#191919] rounded-full w-[98.794px] h-[118.084px] bottom-[-70px] left-[-46px] border-r-4 border-neutral30"></div>
      {/* Centro */}
      <div className="absolute bg-[#191919] rounded-full w-[98.794px] h-[118.084px] hidden md:block md:top-[-90px] md:left-[29%] border-r-2 md:border-b-4 border-neutral30"></div>
      <div className="absolute bg-[#191919] rounded-full w-[98.794px] h-[118.084px] hidden md:block md:bottom-[-90px] md:left-[29%] border-l-2 md:border-t-4 border-neutral30"></div>
      {/* Lateral esquerda */}
      <div className="absolute bg-[#191919] rounded-full w-[98.794px] h-[118.084px] top-[-60px] right-[-26px] border-l-4 border-neutral30"></div>
      <div className="absolute bg-[#191919] rounded-full w-[98.794px] h-[118.084px] bottom-[-60px] right-[-24px] border-l-4 border-neutral30"></div>
      {/* Poster Section */}
      <div className="w-full md:w-1/3 h-[600px] md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-dashed border-neutral30">
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path || backdrop_path}`}
          alt={mediaTitle}
          className="w-full h-[597px] lg:h-full object-cover"
        />
      </div>
      {/* Content Section */}
      <div
        className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col justify-between rounded-b-[15px] md:rounded-r-[15px]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <div>
          <h1 className="text-2xl sm:text-2xl md:text-5xl font-moonjelly text-white mb-4 relative md:right-6">
            {mediaTitle} <span className="text-gray-400">{releaseYear}</span>
          </h1>
          <div className="text-xs sm:text-sm md:text-md text-gray-300 mb-4">
            {mediaType.toUpperCase()} • {mediaRuntime}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4 relative md:left-0 left-2">
            {mediaGenres.split(", ").map((genre, index) => (
              <span
                key={index}
                className="border-2 border-neutral80 bg-neutral90 text-white px-3 py-2 rounded-full text-xs hover:scale-125 cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>
          {/* Tagline */}
          {tagline && tagline.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-2 relative right-3 md:right-0">
              <span className="text-primary40 text-md font-extralight font-moonjelly tracking-wide bg-neutral90 px-4 py-2 rounded-full shadow-lg border-2 border-primary30">
                {tagline}
              </span>
            </div>
          )}

          {/* Overview */}
          <p className="text-gray-300 text-xs sm:text-sm md:text-md mb-6">
            {overview?.length > 300 ? `${overview}` : overview || "No description available."}
          </p>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTrailerModalOpen(true)}
              className="bg-transparent border-2 border-primary90 text-primary40 px-6 py-3 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-lg shadow-md hover:text-white hover:bg-primary80 transition duration-300"
            >
              <AiOutlinePlayCircle size={20} className="mr-2" />
              <span className="text-neutral10">Watch Trailer</span>
            </button>
            {inWatchlist ? (
              <button
                onClick={handleWatchlistToggle}
                className="bg-neutral80 text-primary40 px-4 py-4 rounded-full flex items-center justify-center text-sm sm:text-md md:text-lg shadow-md hover:bg-neutral90 hover:scale-110 transition duration-300 transform hover:shadow-lg"
              >
                <FaBookmark size={24} className="mr-3 text-primary40 opacity-70" />
                <span className="text-primary40 font-medium">Remove to Watchlist</span>
              </button>
            ) : (
              <button
                onClick={handleWatchlistToggle}
                className="bg-primary30 text-white px-4 py-4 rounded-full flex items-center justify-center text-sm sm:text-md md:text-lg shadow-lg hover:bg-primary60 hover:scale-110 transition duration-300 transform hover:shadow-xl"
              >
                <FaBookmark size={24} className="mr-3" />
                Add to Watchlist
              </button>
            )}
          </div>
        </div>

        {/* Rating */}
        {notaMedia && notaMedia.notaGeral > 0 ? (
          <div className="flex flex-col justify-center items-center mt-6 py-4">
            <div className="flex items-center gap-1 cursor-pointer">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index + 1 <= notaMedia.notaGeral ? (
                    <FaStar size={40} className="text-yellow-500 hover:scale-125" />
                  ) : (
                    <FaRegStar size={40} className="text-neutral10 opacity-50" />
                  )}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center absolute bottom-0">
              <span className="text-sm md:text-md text-neutral10">{Math.round(notaMedia.notaGeral * 10)}%</span>
              <span className="text-white font-poppins">({notaMedia.notaGeral.toFixed(0)}/5)</span>
            </div>
          </div>
        ) : (
          <p className="text-center font-poppins text-neutral10">
            <span className="block">Ainda não há  avaliações para este título.</span>
            <span className="block text-sm text-indigo-300">Seja o primeiro a compartilhar sua opinião!</span>
          </p>
        )}
      </div>

      {/* Trailer Modal */}
      <Modal
        isOpen={isTrailerModalOpen}
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
        {trailer ? (
          <div className="relative h-[350px] md:h-[60vh] w-[450px] md:w-[60vw] mx-auto p-2">
            <button
              onClick={closeModal}
              className="absolute top-[-15px] right-[-15px] bg-red-600 text-white text-2xl w-10 h-10 flex justify-center items-center rounded-full shadow-lg hover:bg-red-700 transition duration-200"
            >
              <IoCloseCircleOutline size={44} />
            </button>
            {trailer !== "timeout" ? (
              <iframe
                src={trailer}
                width={"100%"}
                height={"100%"}
                title="Trailer"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            ) : (
              <div className="text-neutral20 text-center text-4xl">O trailer demorou muito para carregar.</div>
            )}
          </div>
        ) : error ? (
          <div className="text-neutral20 text-center text-4xl">Trailer não encontrado.</div>
        ) : (
          <div className="text-white text-center">
            <CircleSpinner size={40} color="#fff" />
          </div>
        )}
      </Modal>
    </div>
  );
};
