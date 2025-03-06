import React, { useEffect, useState } from "react";
import { ReviewContainer } from "../FeedPage/Feed/ReviewContainer";
import { getUsersInfo } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";
import { getReviewsByUserId } from "../../api/review";
import { followUser, getFollowers, getIsFollowing, unfollowUser } from "../../api/followers";
import Modal from "react-modal";
import { FollowList } from "../Utils/FollowList";

Modal.setAppElement("#root");

export const OutherUserPage = ({ id }) => {
  const [currentTab, setCurrentTab] = useState("recent");
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const [showFollow, setShowFollow] = useState("");
  const [isType, setIsType] = useState("");
  const [followers, setFollowers] = useState([]);

  const [isUser, setIsUser] = useState({
    name: "",
    bannerPath: "",
    profilePath: "",
  });
  const [userReview, setUserReview] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUsersInfo(id);
        if (response.user) {
          navigate("/profile");
          return;
        }
        let isUserDto = {
          id: response.id,
          username: response.username,
          name: response.name,
          reviews: response.reviews,
          followers: response.followers,
          followings: response.followings,
          imagePath: response.imagePath ? response.imagePath : "/public/images/profile.png",
          bannerPath: response.bannerPath ? response.bannerPath : "/public/images/user-banner.png",
        };
        setIsUser(isUserDto);
      } catch (error) {
        console.error(error);
        window.location.href = "/404";
        return;
      }
    };

    const fetchUserReview = async () => {
      try {
        const response = await getReviewsByUserId(id);
        setUserReview(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchIsFollow = async () => {
      try {
        const response = await getIsFollowing(id);
        setIsFollowing(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIsFollow();
    fetchUserReview();
    fetchUser();
  }, [isFollowing, id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const response = await unfollowUser(id);
        setIsFollowing(false);
      } else {
        const response = await followUser(id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowers = async (types) => {
    try {
      setShowFollow(true);
      const response = await getFollowers(id, types);
      setFollowers(response);
    } catch (err) {
      setError("Erro ao carregar seguidores.");
    }
  };

  return (
    <>
      <div className="relative w-full mx-auto top-0 flex flex-col overflow-hidden min-h-screen">
        {/* Banner Section */}
        <div
          className="banner bg-cover bg-center h-[465px] w-full rounded-lg absolute object-cover border-b-2 border-neutral60"
          style={{ backgroundImage: `url(${isUser.bannerPath})` }}
        ></div>

        <div className="relative z-10 flex flex-col lg:flex-row mt-[330px] gap-2">
          {/* User Info */}
          <div className="w-full lg:w-[40%] text-center flex flex-col items-center lg:items-start relative left-8 md:left-[10vw]">
            <div className="w-[250px] lg:w-[294px] h-[250px] lg:h-[294px] mb-4 rounded-full overflow-hidden p-2">
              <img
                className="w-full h-full rounded-full object-cover border-2 border-neutral60"
                src={isUser.imagePath}
                alt="User"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-neutral10 mb-2 font-moonjelly text-center lg:text-left flex flex-col">
              {isUser.name}
              <span className="text-lg text-primary80 font-poppins text-center hover:underline hover:cursor-pointer">@{isUser.username}</span>
            </h1>

            <div className="flex justify-center lg:justify-start gap-8 mt-4 text-neutral10 font-poppins">
              <div>
                <p className="text-sm font-bold text-center">{isUser.reviews}</p>
                <p className="text-sm">Reviews</p>
              </div>
              <div
                onClick={() => {
                  setIsType("followers");
                  fetchFollowers("followers");
                }}
                className="cursor-pointer "
              >
                <p className="text-sm font-bold text-center">{isUser.followers}</p>
                <p className="text-sm">Seguidores</p>
              </div>
              <div
                onClick={() => {
                  setIsType("followings");
                  fetchFollowers("followings");
                }}
                className="cursor-pointer"
              >
                <p className="text-sm font-bold text-center">{isUser.followings}</p>
                <p className="text-sm">Seguindo</p>
              </div>
            </div>
            <button
              className={`relative md:left-[-12px] w-[290px] mt-6 p-2 rounded transition duration-300 ${
                isFollowing
                  ? "bg-neutral10 text-neutral80 hover:bg-neutral20 hover:opacity-80"
                  : "bg-primary40 text-white hover:bg-primary30 hover:opacity-90 hover:shadow-lg"
              }`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          {/* Reviews Section */}
          <div className="w-full lg:w-[100%] relative left-0 md:left-8 top-0 lg:top-32">
            {/* Tabs */}
            <div className="flex justify-evenly mt-12 lg:justify-start gap-4 mb-6 text-neutral10 font-poppins">
              <button
                className={`px-4 py-2 rounded-lg ${
                  currentTab === "recent" ? "bg-primary40 text-white" : "bg-neutral10 text-neutral80 hover:bg-neutral20"
                }`}
                onClick={() => setCurrentTab("recent")}
              >
                {window.innerWidth > 768 ? "Most Recent" : "Recent"}
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  currentTab === "top" ? "bg-primary40 text-white" : "bg-neutral10 text-neutral80 hover:bg-neutral20"
                }`}
                onClick={() => setCurrentTab("top")}
              >
                {window.innerWidth > 768 ? "Top Reviews" : "Top"}
              </button>
            </div>

            {/* Review Container */}
            <div className="relative left-8 md:left-0 w-full lg:w-[90%] space-y-12 mb-[16vh]">
              {currentTab === "recent" &&
                (userReview && userReview.length > 0 ? (
                  userReview.map((review) => (
                    <ReviewContainer
                      key={review.id}
                      movieId={review.mediaId}
                      plataform={review.mediaType}
                      profileId={isUser.username}
                      reviewId={review.id}
                    />
                  ))
                ) : (
                  <div className="flex items-center flex-col justify-center">
                    <img src="/images/no-content.svg" alt="Sem conteúdo" className="w-[400px] h-[350px] mx-auto" />
                    <p className="text-2xl font-bold text-neutral10 font-moonjelly">Nehuma Resenha Publicada!</p>
                  </div>
                ))}
              {currentTab === "top" && (
                <>
                  <div className="flex items-center flex-col justify-center">
                    <img src="/images/no-content.svg" alt="Sem conteúdo" className="w-[400px] h-[350px] mx-auto" />
                    <p className="text-2xl font-bold text-neutral10 font-moonjelly">Nehuma Resenha Encontrada!</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {showFollow && (
          <FollowList showFollow={showFollow} setShowFollow={setShowFollow} followers={followers} isType={isType} />
        )}
      </div>
    </>
  );
};
