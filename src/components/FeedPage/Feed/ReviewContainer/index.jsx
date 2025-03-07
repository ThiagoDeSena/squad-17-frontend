import React, { useState, useEffect } from "react";
import { FaEdit, FaStar, FaTimes } from "react-icons/fa";
import { getMediaDetails } from "../../../../api/movieAPI";
import { RecomendedCard } from "../../Recomended/RecomendedCard";
import { BiSolidDislike, BiSolidHeart } from "react-icons/bi";
import { PiChatCircleTextFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../../Utils/Loading";
import { formatDistanceToNow } from "date-fns";
import Modal from "react-modal";
import { ReviewPost } from "../../ReviewPost";
import {
  deleteReview,
  getReviewInterations,
  getReviewsById,
  interationReview,
  verifyInteraction,
} from "../../../../api/review";
import { getUsersInfo } from "../../../../api/userAPI";
import { FiEdit2, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import ConfirmDelete from "../../../Utils/ConfirmDelete";
import { InterationList } from "../../../Utils/InterationList";
Modal.setAppElement("#root");

export const ReviewContainer = ({
  movieId,
  plataform,
  profileId,
  reviewId,
  isComment = false,
  isCommentDelete = false,
  isCommentPage = false,
  selfProfile = false,
  setDelete = false,
  deleted=false,
}) => {
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [review, setReview] = useState();
  const [user, setUser] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [likeed, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isModalInterationOpen, setIsModalInterationOpen] = useState(false);
  const [interation, setInteration] = useState([]);
  const [isType, setIsType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [reviewResponse, userResponse, mediaResponse, verifyResponse] = await Promise.all([
          getReviewsById(reviewId),
          getUsersInfo(profileId),
          getMediaDetails(plataform, movieId),
        ]);

        setReview({
          nota: reviewResponse?.nota || 0,
          content: reviewResponse?.content || "",
          containsSpoiler: reviewResponse?.containsSpoiler || false,
          dataCriacao: reviewResponse?.dataCriacao || "",
          updatedAt: reviewResponse?.updatedAt || "",
          likes: reviewResponse?.likes || 0,
          deslikes: reviewResponse?.deslikes || 0,
          comentarios: reviewResponse?.comentarios || 0,
        });

        setUser(userResponse || {});
        setMediaData(mediaResponse || {});
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchInteration = async () => {
      try {
        const [likedResponse, dislikeResponse] = await Promise.all([
          verifyInteraction(reviewId, "like"),
          verifyInteraction(reviewId, "dislike"),
        ]);
        setLiked(likedResponse);
        setDisliked(dislikeResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInteration();
    fetchData();
  }, [reviewId, profileId, movieId, plataform, isComment, isCommentDelete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 w-full">
        <Loading message="Carregando detalhes..." />
      </div>
    );
  }

  if (!mediaData) {
    return (
      <div className="inset-0 w-full mx-auto text-center">
        <p className="text-white flex flex-col justify-center items-center gap-2">
          <img src="/images/asking-question.svg" height={300} width={300} alt="" />
          Nenhum Dado Encontrado.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const response = await deleteReview(reviewId);
      if (response === 204) {
        setIsDelete(!isDelete);
        setDelete(!deleted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handeInteration = async (interation) => {
    const fetchInteration = async () => {
      try {
        const [likedResponse, dislikeResponse, responseReview] = await Promise.all([
          verifyInteraction(reviewId, "like"),
          verifyInteraction(reviewId, "dislike"),
          getReviewsById(reviewId),
        ]);
        setLiked(likedResponse);
        setDisliked(dislikeResponse);
        setReview({
          nota: responseReview?.nota || 0,
          content: responseReview?.content || "",
          containsSpoiler: responseReview?.containsSpoiler || false,
          dataCriacao: responseReview?.dataCriacao || "",
          updatedAt: responseReview?.updatedAt || "",
          likes: responseReview?.likes || 0,
          deslikes: responseReview?.deslikes || 0,
          comentarios: responseReview?.comentarios || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    try {
      const response = await interationReview(reviewId, interation);
      if (response) {
        fetchInteration();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "";
  };

  const displayDate =
    review.updatedAt || review.dataCriacao
      ? new Date(review.updatedAt) > new Date(review.dataCriacao)
        ? review.updatedAt
        : review.dataCriacao
      : "";

  const fetchInterationList = async (id, type) => {
    try {
      setIsType(type);
      setIsModalInterationOpen(true);
      const response = await getReviewInterations(id, type);
      console.log(response)
      return setInteration(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className={`bg-transparent  border-b  border-primary90 ${
        selfProfile ? "p-9" : "p-4"
      } rounded-lg mb-[5%] flex flex-col-reverse md:flex-row-reverse gap-6 w-[80%] lg:w-full m-auto`}
    >
      {/* Imagem da Avaliação */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <RecomendedCard
          image={`https://image.tmdb.org/t/p/w1280/${mediaData.backdrop_path}`}
          title={mediaData.title || mediaData.name || "Título não disponível"}
          genre={mediaData.genres?.map((genre) => genre.name).join(", ")}
          className="relative w-full h-56 md:h-96 rounded-lg overflow-hidden shadow-sm shadow-neutral60 cursor-pointer transform ease-in-out hover:scale-105 font-poppins text-center border-2 border-neutral80"
          id={movieId}
          type={plataform}
        />
      </div>

      {/* Conteúdo */}
      <div className="w-full md:w-2/3 flex flex-col justify-between font-poppins text-white">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-4 relative">
            <img
              src={user.imagePath || "/public/images/profile.png"}
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary20 hover:scale-125 transition duration-300 hover:cursor-pointer"
              onClick={selfProfile ? () => navigate("/profile") : () => navigate(`/user/${user.username}`)}
            />
            <div>
              <p className="text-xs md:text-sm text-gray-400">
                {review.updatedAt ? "updated" : ""} {formatDate(displayDate)}{" "}
              </p>
              <p
                className="font-semibold text-sm md:text-base hover:underline hover:cursor-pointer text-left"
                onClick={() => navigate(`/user/${user.username}`)}
              >
                {selfProfile ? "Você" : user.username}
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer ${i < review.nota ? "text-yellow-500" : "text-gray-500"}`}
                  />
                ))}
              </div>
            </div>
            {selfProfile && (
              <div className="absolute top-2 right-2 flex items-center gap-2">
                {/* Botão principal */}
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="bg-primary20 text-neutral40 px-2 py-1 rounded-md hover:bg-primary30 hover:text-neutral10 transition-all duration-300 ease-in-out"
                >
                  <FiMoreVertical size={24} />
                </button>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex  items-center gap-2 relative"
                  >
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        setEdit(true);
                      }}
                      className="bg-semanticInfo text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out "
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsDelete(true);
                        setShowOptions(false);
                      }}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-300 ease-in-out"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Conteúdo da Resenha */}
          {review.containsSpoiler && !selfProfile && !showSpoiler && !isCommentPage ? (
            <div className="bg-orange-700 p-2 mb-4 rounded flex items-center justify-between">
              <p className="text-sm text-white">
                <strong>Aviso de Spoiler:</strong> Esta resenha contém spoilers.
              </p>
              <button
                onClick={() => setShowSpoiler(true)}
                className="underline font-bold text-neutral90 text-sm hover:text-white transition duration-300 ease-in-out"
              >
                Mostrar Resenha
              </button>
            </div>
          ) : (
            // Resenha do usuário
            <p className="text-neutral20 max-h-48 md:max-h-64 leading-relaxed tracking-wide text-justify indent-6 text-xs md:text-sm overflow-auto p-2">
              {review.content}
            </p>
          )}
        </div>

        {/* Interações */}
        <div className="flex gap-4 mt-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                handeInteration("like");
              }}
              className="flex items-center gap-1"
            >
              <BiSolidHeart
                className={`text-lg md:text-xl transition-all duration-[300ms] ease-in-out ${
                  likeed ? "text-red-600 animate-pulse scale-125" : "text-neutral50"
                }`}
                style={{
                  animation: likeed ? "pulse 3s ease-in-out forwards" : "none",
                }}
              />
            </button>
            <span
              onClick={() => review.likes > 0 ? fetchInterationList(reviewId, "like") : ""}
              className={`${review.likes > 0 ? "text-neutral10 font-bold cursor-pointer" : ""}`}
            >
              {review.likes}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                handeInteration("dislike");
              }}
              className="flex items-center gap-1"
            >
              <BiSolidDislike
                className={`text-lg md:text-xl transition-all duration-[300ms] ease-in-out ${
                  disliked ? "text-yellow-600 animate-pulse scale-125" : "text-neutral50"
                }`}
                style={{
                  animation: disliked ? "pulse 3s ease-in-out forwards" : "none",
                }}
              />
            </button>
            <span
              onClick={() => review.deslikes > 0 ? fetchInterationList(reviewId, "dislike") : ""}
              className={`${review.deslikes > 0 ? "text-neutral10 font-bold cursor-pointer" : ""}`}
            >
              {review.deslikes}
            </span>
          </div>

          <button className="flex items-center gap-1" onClick={() => navigate(`/review/${reviewId}`)}>
            <PiChatCircleTextFill className="text-lg md:text-xl text-neutral50" />
            {review.comentarios}
          </button>
        </div>
      </div>

      {isDelete && (
        <ConfirmDelete
          text={"Tem certeza que deseja excluir esta review?"}
          isOpen={isDelete}
          onClose={() => setIsDelete(!isDelete)}
          onConfirm={handleDelete}
        />
      )}

      {edit && (
        <Modal
          isOpen={edit}
          onRequestClose={() => setEdit(false)}
          className="flex justify-center items-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          style={{ overlay: { zIndex: 2002 } }}
        >
          <div className="fixed inset-0 bg-neutral90 flex justify-center items-center">
            {/* Header do Modal */}
            <div className="w-[100%]">
              <div className="flex justify-center    items-center mb-4">
                <h2 className="text-3xl md:text-4xl font-semibold text-white text-center font-moonjelly mx-auto">
                  Editar Review
                </h2>
                <button
                  onClick={() => setEdit(false)}
                  className="text-white hover:text-red-500 transition-colors duration-300 absolute right-0 top-5"
                >
                  <FaTimes size={40} />
                </button>
              </div>
              <ReviewPost
                unique={true}
                uniqueTitle={mediaData.title || mediaData.name || "Título não disponível"}
                uniqueMedia={mediaData}
                reviewId={reviewId}
                setEdit={setEdit}
              />
            </div>
          </div>
        </Modal>
      )}

      {isModalInterationOpen && (
        <InterationList
          showInteration={isModalInterationOpen}
          setShowInteration={setIsModalInterationOpen}
          interation={interation}
          isType={isType}
        />
      )}
    </div>
  );
};
