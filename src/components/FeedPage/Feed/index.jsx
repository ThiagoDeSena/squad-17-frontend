import React, { useEffect, useState } from "react";
import { ReviewContainer } from "./ReviewContainer"; // Componente de resenha
import { FiStar, FiUsers } from "react-icons/fi";
import { getReviewByFollowing, getReviews } from "../../../api/review";
import { getUsersInfo } from "../../../api/userAPI";
export const Feed = ({ isPost }) => {
  const [activeTab, setActiveTab] = useState("followedReviews");
  const [feedReviews, setFeedReviews] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const [followingReviews, myReviews] = await Promise.all([
          getReviewByFollowing(),
          getReviews(),
        ]);

        let reviews = [];

        if (followingReviews && followingReviews.length > 0) {
          reviews = followingReviews;
        }

        if (myReviews && myReviews.length > 0) {
          reviews = [...reviews, ...myReviews].sort((a, b) => {
            const dateA = new Date(a.dataCriacao);
            const dateB = new Date(b.dataCriacao);
            return dateB - dateA;
          });
        }

        if (reviews && reviews.length > 0) {
          const userDataPromise = reviews.map(async (review) => {
            const userData = await getUsersInfo(review.userId);
            return { ...review, userData };
          });
          const userData = await Promise.all(userDataPromise);
          setFeedReviews(userData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeed();
  }, [isPost, isDelete]);

  return (
    <div className="bg-transparent  p-4 max-w-2xl md:max-w-4xl mx-auto mt-12 font-poppins mb-12">
      {/* Abas */}
      <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-between mb-8 max-w-[300px] md:max-w-2xl relative left-[10%] md:left-0 mx-auto">
        <button
          onClick={() => setActiveTab("bestReviews")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg shadow-md flex items-center h-fit ${
            activeTab === "bestReviews"
              ? "bg-primary30 text-white"
              : "bg-[#F7F7F7] text-[#4A4A4A] hover:bg-[#181818] hover:text-white transition duration-300"
          }`}
        >
          <span className="mr-2">
            <FiStar size={20} color={activeTab === "bestReviews" ? "#fff" : "#4A4A4A"} />
          </span>
          Melhores Avaliações
        </button>
        <button
          onClick={() => setActiveTab("followedReviews")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg shadow-md flex  items-center h-fit  ${
            activeTab === "followedReviews"
              ? "bg-primary70 text-white"
              : "bg-[#F7F7F7] text-[#4A4A4A] hover:bg-[#181818] hover:text-white transition duration-300"
          }`}
        >
          <span className="mr-2">
            <FiUsers size={20} color={activeTab === "followedReviews" ? "#fff" : "#4A4A4A"} />
          </span>
          Minha Rede
        </button>
      </div>

      {/* Conteúdo do Feed */}
      <div className={`relative left-8 lg:left-0 grid gap-6 ${activeTab === "bestReviews" ? "animate-fade-in" : ""}`}>
        {activeTab === "bestReviews" && (
          <div>
            {/* Resenhas mais relevantes */}
            <ReviewContainer movieId={426063} plataform={"movie"} reviewId={15} profileId={4}/>
            <ReviewContainer movieId={219937} plataform={"tv"} reviewId={18} profileId={8} />
          </div>
        )}
        {activeTab === "followedReviews" && (
          <div className="flex flex-col items-center text-center gap-4">
            {/* Verifica se há postagens */}
            {feedReviews && feedReviews.length === 0 ? (
              <div className="bg-neutral90 p-2 rounded-xl w-2/3 lg:w-full">
                <img src="/images/no-content.svg" alt="Sem conteúdo" className="w-[400px] h-[350px] mx-auto" />
                <p className="text-lg font-medium text-neutral-400">
                  Você ainda não segue ninguém ou não há postagens disponíveis.
                </p>
                <p className="text-sm text-neutral-500">Siga outros usuários para ver suas avaliações aqui!</p>
              </div>
            ) : (
              <div className="w-full">
                {feedReviews.map((review) => (
                  <ReviewContainer
                    key={review.id}
                    reviewId={review.id}
                    selfProfile={review.isUser}
                    movieId={review.mediaId}
                    plataform={review.mediaType}
                    profileId={review.userId}
                    setDelete={setIsDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
