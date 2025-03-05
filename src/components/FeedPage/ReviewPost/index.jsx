import React, { useState, useEffect } from "react";
import { BiMessageRoundedDetail, BiWindowClose } from "react-icons/bi";
import { searchResults, getPopularMovies } from "../../../api/movieAPI";
import Modal from "react-modal";
import { Loading } from "../../Utils/Loading";
import { SphereSpinner } from "react-spinners-kit";
import { createReview, getReviewsById, updateReview } from "../../../api/review";
import { AlertWindow } from "../../Utils/AlertWindow";

export const ReviewPost = ({
  unique = false,
  uniqueTitle = null,
  uniqueMedia = [],
  setIsPost = false,
  reviewId,
  setEdit,
}) => {
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedMediaId, setSelectedMediaId] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [selectedMediaBanner, setSelectedMediaBanner] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsList, setSearchResultsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const maxChars = 3000;
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
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

  useEffect(() => {
    if (!searchQuery) return;
    setPage(1);
    setSearchResultsList([]);
  }, [searchQuery]);

  useEffect(() => {
    const fetchQuery = async () => {
      setLoading(true);
      try {
        const { success, data, message } = await searchResults(searchQuery, {
          page,
        });
        if (success) {
          setSearchResultsList((prevResults) =>
            page === 1
              ? data
              : [...prevResults, ...data.filter((newItem) => !prevResults.some((item) => item.id === newItem.id))]
          );
          setHasMore(data.length > 0);
        } else {
          console.error(message);
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuery();
  }, [searchQuery, page]);

  const handleScroll = ({ target: { scrollTop, scrollHeight, clientHeight } }) => {
    if (scrollTop + clientHeight >= scrollHeight - 250 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleMediaSelect = (media) => {
    setSelectedMediaId(media.id);
    setSelectedMediaType(media.media_type);
    setSelectedMediaBanner(media.backdrop_path || media.poster_path || "");
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (unique && uniqueMedia) {
      handleMediaSelect(uniqueMedia);
    }
  }, [unique, uniqueMedia]);

  const handleSubmit = async () => {
    if (!reviewText || !selectedMediaId) {
      alert("Preencha todos os campos antes de publicar.");
      return;
    }
    const payload = {
      content: reviewText,
      mediaId: selectedMediaId,
      mediaType: selectedMediaType,
      nota: selectedRating,
      containsSpoiler: containsSpoilers,
    };
    try {
      if (!reviewId) {
        const response = await createReview(payload);
        if (response) {
          setAlert({
            show: true,
            message: `Review postada com sucesso`,
            type: "success",
          });
          setIsPost(response.data.id);
        }
      } else {
        const update = {
          content: reviewText,
          nota: selectedRating,
          containsSpoiler: containsSpoilers,
        };
        const response = await updateReview(reviewId, update);
        if (response) {
          setAlert({
            show: true,
            message: `Review atualizada com sucesso`,
            type: "success",
          });
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Erro ao enviar resenha:", error);
      setAlert({
        show: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setReviewText("");
      setContainsSpoilers(false);
      setSelectedRating(0);
      setSelectedMediaId("");
      setSelectedMediaBanner("");
    }
  };
  useEffect(() => {
    if (alert.show) {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  }, [alert.show]);

  useEffect(() => {
    const fetchReview = async () => {
      if (reviewId) {
        try {
          const response = await getReviewsById(reviewId);
          if (response) {
            setReviewText(response.content);
            setSelectedRating(response.nota);
            setContainsSpoilers(response.containsSpoiler);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchReview();
  }, []);

  return (
    <>
      {alert.show && (
        <AlertWindow message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
      )}
      <div className="bg-transparent-800 border-2 border-neutral-700 text-white p-2 md:p-8 rounded-lg w-[350px] md:w-[600px] lg:w-full max-w-xl md:max-w-4xl md:mx-auto mt-8 md:mt-12 flex flex-col gap-6 font-poppins md:relative transform -translate-x-[-20vw] md:translate-x-0 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <h2 className="text-lg md:text-xl font-semibold">
            {unique ? (
              <p>
                Poste uma Nova Resenha sobre <span className="text-primary50">{uniqueTitle}</span>
              </p>
            ) : (
              <p>Poste uma Nova Resenha sobre um filme ou série</p>
            )}
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
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
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
                {maxChars - reviewText.length}/{maxChars}
              </span>
              <div className="flex items-center gap-2 absolute top-2 md:top-0 md:right-2">
                <span className="text-xs md:text-sm w-28 md:w-full">* Sua Nota:</span>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
                  className="w-full md:w-32 bg-neutral70 appearance-none rounded-lg focus:outline-none"
                />
                <span className="text-sm">{selectedRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          {/* Botão de Seleção de Mídia */}
          <div className="mt-4 w-full lg:w-72">
            {!unique && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary30 hover:bg-primary40 text-white py-2 px-4 rounded-lg"
              >
                * Escolher Filme/Série
              </button>
            )}
            {selectedMediaBanner ? (
              <div
                className="w-full h-52 md:h-48 bg-cover bg-center rounded-xl border border-dotted border-neutral80 mt-4"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${selectedMediaBanner})`,
                }}
              ></div>
            ) : (
              <div
                className="w-full h-52 md:h-48 bg-cover bg-center rounded-xl border border-dotted border-neutral80 mt-4"
                style={{
                  backgroundImage: `url(./images/placeholder.png)`,
                }}
              ></div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className={`bg-primary50 hover:bg-primary40 text-white py-2 px-2 md:px-4 rounded-lg flex items-center lg:absolute lg:bottom-${unique ? "4": "6"}  gap-4 self-center lg:self-start bottom-4
                ${
                  reviewText.length === 0 || selectedMediaId === ""
                    ? "pointer-events-none opacity-50 cursor-not-allowed"
                    : " cursor-pointer"
                }`}
          disabled={reviewText.length === 0 || selectedMediaId === "" || loading}
        >
          {reviewId ? "Atualizar Resenha " : "Postar Nova Resenha"}
          <BiMessageRoundedDetail size={28} />
        </button>

        {/* Modal de Seleção de Mídia */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="absolute inset-0 bg-neutral-800 border-2 border-neutral-700 text-white p-0 rounded-lg max-w-3xl w-full max-h-[800px] mx-auto mt-12 overflow-y-hidden overflow-x-hidden font-poppins"
          overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          style={{ overlay: { zIndex: 2002 } }}
          contentLabel="Modal de Seleção de Mídia"
        >
          <div className="overflow-y-auto p-4" onScroll={handleScroll} style={{ maxHeight: "800px" }}>
            <button
              type="button"
              className="absolute right-0 top-0 p-2 focus:outline-none"
              onClick={() => setIsModalOpen(false)}
            >
              <BiWindowClose size={30} className="text-primary50" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Escolha um Filme ou Série</h3>
            <input
              type="text"
              placeholder="Pesquisar por filme ou série..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full p-2 mb-4 bg-neutral-700 rounded-lg focus:outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              {(searchQuery ? searchResultsList : mediaList).map(
                (media) =>
                  media.backdrop_path && (
                    <div
                      key={media.id}
                      onClick={() => handleMediaSelect(media)}
                      className="cursor-pointer relative h-40 rounded-lg"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center rounded-lg"
                        style={{
                          backgroundImage: `url(https://image.tmdb.org/t/p/w500/${
                            media.backdrop_path || media.poster_path
                          })`,
                        }}
                      >
                        {!media.backdrop_path && !media.poster_path && <SphereSpinner />}
                      </div>
                      <div className="absolute inset-0 bg-black/20 bg-opacity-50 flex items-end justify-center rounded-lg">
                        <p className="font-bold text-neutral10 bg-black/30 bg-opacity-70 px-4 py-2 text-center truncate backdrop-blur-md w-full">
                          {media.title || media.name}
                        </p>
                      </div>
                    </div>
                  )
              )}
              {/* Feedback */}
              {loading && (
                <div className="absolute top-32 inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm">
                  <Loading size={60} color="#F9370B" />
                </div>
              )}
              {/* Caso não haja nenhum resultado */}
              {searchQuery.length > 0 && !loading && searchResultsList.length === 0 && (
                <p className="mt-6 text-white absolute flex justify-center items-center font-semibold">
                  Nenhum resultado encontrado para {searchQuery}
                </p>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
