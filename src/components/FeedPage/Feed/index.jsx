import React, { useEffect, useState, useRef, useCallback } from "react";
import { ReviewContainer } from "./ReviewContainer";
import { FiStar, FiUsers } from "react-icons/fi";
import { getReviewByFollowing, getReviews, getTopReviews } from "../../../api/review";
import { getUsersInfo } from "../../../api/userAPI";
import { Loading } from "../../Utils/Loading";

export const Feed = ({ isPost }) => {
  const [activeTab, setActiveTab] = useState("followedReviews");

  const [bestReviews, setBestReviews] = useState([]);
  const [bestPage, setBestPage] = useState(0);
  const [hasMoreBest, setHasMoreBest] = useState(true);

  const [followingReviews, setFollowingReviews] = useState([]);
  const [followingPage, setFollowingPage] = useState(0);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);

  const [myReviews, setMyReviews] = useState([]);
  const [myPage, setMyPage] = useState(0);
  const [hasMoreMyReviews, setHasMoreMyReviews] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const observer = useRef();

  useEffect(() => {
    setBestPage(0);
    setFollowingPage(0);
    setMyPage(0);
    setBestReviews([]);
    setFollowingReviews([]);
    setMyReviews([]);
    setHasMoreBest(true);
    setHasMoreFollowing(true);
    setHasMoreMyReviews(true);
  }, [isPost]);

  const fetchBestReviews = async (pageNumber) => {
    if (isLoading || !hasMoreBest) return;
    setIsLoading(true);
    try {
      const response = await getTopReviews(pageNumber);
      setBestReviews((prev) => (pageNumber === 0 ? response.content : [...prev, ...response.content]));
      setHasMoreBest(!response.empty);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowingReviews = async (pageNumber) => {
    if (isLoading || !hasMoreFollowing) return;
    setIsLoading(true);
    try {
      const response = await getReviewByFollowing(pageNumber);

      setFollowingReviews((prev) => (pageNumber === 0 ? response.content : [...prev, ...response.content]));
      setHasMoreFollowing(!response.empty);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyReviews = async (pageNumber) => {
    if (isLoading || !hasMoreMyReviews) return;
    setIsLoading(true);
    try {
      const response = await getReviews(pageNumber);
      console.log(response.content);
      setMyReviews((prev) => (pageNumber === 0 ? response.content : [...prev, ...response.content]));
      setHasMoreMyReviews(!response.empty);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      if (activeTab === "bestReviews") {
        fetchBestReviews(0);
      } else {
        fetchFollowingReviews(0);
        fetchMyReviews(0);
      }
    },
    [activeTab, isPost, isDelete]
  );

  const lastReviewRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (activeTab === "bestReviews" && hasMoreBest) {
              setBestPage((prevPage) => prevPage + 1);
            } else {
              if (hasMoreFollowing) setFollowingPage((prev) => prev + 1);
              if (hasMoreMyReviews) setMyPage((prev) => prev + 1);
            }
          }
        },
        { threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMoreBest, hasMoreFollowing, hasMoreMyReviews, activeTab]
  );

  useEffect(() => {
    if (bestPage > 0 && activeTab === "bestReviews") fetchBestReviews(bestPage);
  }, [bestPage]);

  useEffect(() => {
    if (followingPage > 0) fetchFollowingReviews(followingPage);
  }, [followingPage]);

  useEffect(() => {
    if (myPage > 0) fetchMyReviews(myPage);
  }, [myPage]);

  return (
    <>
      <div className="bg-transparent p-4 max-w-2xl md:max-w-4xl mx-auto mt-12 font-poppins mb-12 overflow-y-hidden">
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
            className={`px-4 py-2 text-lg font-semibold rounded-lg shadow-md flex items-center h-fit ${
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
              {bestReviews.map((review, index) => (
                <div key={review.id} ref={index === bestReviews.length - 1 ? lastReviewRef : null}>
                  <ReviewContainer
                    key={review.id}
                    selfProfile={review.isUser}
                    movieId={review.mediaId}
                    plataform={review.mediaType}
                    reviewId={review.id}
                    profileId={review.username}
                    setDelete={setIsDelete}
                    deleted={isDelete}
                  />
                </div>
              ))}
            </div>
          )}
          {activeTab === "followedReviews" && (
            <div className="flex flex-col items-center text-center gap-4">
              {followingReviews && myReviews && followingReviews.length === 0 && myReviews.length === 0 ? (
                <div className="bg-neutral90 p-2 rounded-xl w-2/3 lg:w-full">
                  <img src="/images/no-content.svg" alt="Sem conteúdo" className="w-[400px] h-[350px] mx-auto" />
                  <p className="text-lg font-medium text-neutral-400">
                    Você ainda não segue ninguém ou não há postagens disponíveis.
                  </p>
                  <p className="text-sm text-neutral-500">Siga outros usuários para ver suas avaliações aqui!</p>
                </div>
              ) : (
                <div className="w-full">
                  {([...followingReviews, ...myReviews].length > 0 ? [...followingReviews, ...myReviews] : myReviews)
                    .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                    .map((review, index, arr) => (
                      <div key={review.id} ref={index === arr.length - 1 ? lastReviewRef : null}>
                        <ReviewContainer
                          key={review.id}
                          reviewId={review.id}
                          selfProfile={review.isUser}
                          movieId={review.mediaId}
                          plataform={review.mediaType}
                          profileId={review.username}
                          setDelete={setIsDelete}
                          deleted={isDelete}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mensagem de fim do feed */}
        {!hasMoreBest && activeTab === "bestReviews" && (
          <div className="text-center text-neutral-500 mt-4">
            <p>Não há mais avaliações para carregar.</p>
          </div>
        )}
        {!hasMoreFollowing && !hasMoreMyReviews && activeTab === "followedReviews" && (
          <div className="text-center text-neutral-500 mt-4">
            <p>Não há mais avaliações para carregar.</p>
          </div>
        )}
      </div>
    </>
  );
};
