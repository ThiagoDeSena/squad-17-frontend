import React, { useContext, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Modal from "react-modal";
import { ReviewPost } from "../FeedPage/ReviewPost";
import { ReviewContainer } from "../FeedPage/Feed/ReviewContainer";
import { MdModeEdit } from "react-icons/md";
import { fetchFileImage } from "../../api/image";
import { Loading } from "../Utils/Loading";
import { FaPlus } from "react-icons/fa";
import { AlertWindow } from "../Utils/AlertWindow";
import { getUser, putBannerProfile, putImageProfile } from "../../api/userAPI";
import { getReviews } from "../../api/review";
import { getFollowers } from "../../api/followers";
import { FollowList } from "../Utils/FollowList";
import { ProfileImageModal } from "./ProfileImageModal";
import { BannerProfileModal } from "./BannerProfileModal";
import { EditProfileModal } from "./EditProfileModal";

Modal.setAppElement("#root");

export const UserPage = () => {
  const [userInfo, setUserInfo] = useState({
    id: 0,
    name: "",
    username: "",
    email: "",
    imagePath: localStorage.getItem("profilePath") || "/images/profile.png",
    bannerPath: localStorage.getItem("bannerPath") || "/images/user-banner.png",
    reviews: 0,
    followers: 0,
    followings: 0,
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [editBanner, setEditBanner] = useState(false);
  const [isSelectImageOpen, setIsSelectImageOpen] = useState(false);
  const [isSelectBannerOpen, setIsSelectBannerOpen] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(userInfo.imagePath);
  const [isPost, setIsPost] = useState();
  const [selectedBanner, setSelectedBanner] = useState(userInfo.bannerPath);
  const [clickMore, setClickMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFollow, setShowFollow] = useState("");
  const [isType, setIsType] = useState("");
  const [followers, setFollowers] = useState([]);
  const [profileImage, setProfileImage] = useState({
    profileImages: [],
    next_cursor: null,
  });
  const [onUpdate, setOnUpdate] = useState({});

  const [userReview, setUserReview] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await getUser();

        setUserInfo({
          id: response.id,
          name: response.name,
          username: response.username,
          email: response.email,
          imagePath: response.imagePath ? response.imagePath : "/images/profile.png",
          bannerPath: response.bannerPath ? response.bannerPath : "/images/user-banner.png",
          reviews: response.reviews,
          followers: response.followers,
          followings: response.followings,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserReview = async () => {
      try {
        const response = await getReviews();
        setUserReview(response.content);
      } catch (error) {
        console.error(error);
      }
    };

    if (isPost) {
      setTimeout(() => {
        fetchUserInfo();
      }, 1000);
    } else {
      fetchUserInfo();
    }
    fetchUserReview();
  }, [isPost, isDelete, onUpdate]);

  const [alertWindow, setAlertWindow] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchImages = async () => {
      let folder;
      if (isSelectBannerOpen) {
        folder = "critix_banner";
      } else {
        folder = "critix_profile";
      }
      setLoading(true);
      try {
        const response = await fetchFileImage(null, folder);
        setProfileImage({
          profileImages: response.data.resources,
          next_cursor: response.data.next_cursor,
        });
      } catch (error) {
        console.error("Failed to load images", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [isSelectImageOpen, isSelectBannerOpen]);

  const handleMore = async () => {
    try {
      let folder;
      if (isSelectBannerOpen) {
        folder = "critix_banner";
      } else {
        folder = "critix_profile";
      }
      setClickMore(true);
      const response = await fetchFileImage(profileImage.next_cursor, folder);
      const { resources, next_cursor } = response.data;

      setProfileImage((prev) => ({
        ...prev,
        profileImages: [
          ...prev.profileImages,
          ...resources.filter((newItem) => !prev.profileImages.some((item) => item.asset_id === newItem.asset_id)),
        ],
        next_cursor,
      }));
    } catch (error) {
      console.error("Failed to load images", error);
    } finally {
      setClickMore(false);
    }
  };

  const handleProfileImage = async (selected) => {
    const currentProfilePath = localStorage.getItem("profilePath");
    if (selected === currentProfilePath) {
      return setAlertWindow({
        message: "Select our profile Image!",
        type: "error",
      });
    }
    try {
      await putImageProfile(selected);
      localStorage.setItem("profilePath", selected);
      setAlertWindow({
        message: "Profile image updated successfully!",
        type: "success",
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileBanner = async (selected) => {
    const currentBannerPath = localStorage.getItem("bannerPath");
    if (selected === currentBannerPath) {
      return setAlertWindow({
        message: "Select our banner Image!",
        type: "error",
      });
    }
    try {
      await putBannerProfile(selected);
      localStorage.setItem("bannerPath", selected);
      setAlertWindow({
        message: "Banner image updated successfully!",
        type: "success",
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowers = async (types) => {
    try {
      setShowFollow(true);
      const response = await getFollowers(userInfo.username, types);
      setFollowers(response);
    } catch (err) {
      setError("Erro ao carregar seguidores.");
    }
  };

  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => setWidth(window.innerWidth));

  return (
    <div className="relative w-full mx-auto top-0 flex flex-col overflow-hidden">
      {alertWindow.message && <AlertWindow message={alertWindow.message} type={alertWindow.type} />}
      {/* Banner Section */}
      <div
        className="banner bg-cover bg-center h-[465px] w-full rounded-lg absolute object-cover border-b-2 border-neutral60"
        style={{ backgroundImage: `url(${userInfo.bannerPath})` }}
        onMouseEnter={() => setEditBanner(true)}
        onMouseLeave={() => setTimeout(() => setEditBanner(false), 2000)}
      >
        {editBanner && !isSelectBannerOpen && (
          <div
            className={`absolute  mt-4 md:bottom-4 right-4 flex items-center gap-2 bg-primary40 text-neutral10 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-primary30 transition duration-300`}
            style={{ zIndex: 100 }}
            onClick={() => setIsSelectBannerOpen(true)}
          >
            <MdModeEdit size={20} />
            <p className="text-sm font-semibold">Edit Cover</p>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row mt-[330px] gap-2">
        <div className="w-full lg:w-[40%] text-center flex flex-col items-center lg:items-start relative left-8 md:left-[10vw]">
          <div className="relative">
            <div className="w-[250px] lg:w-[294px] h-[250px] lg:h-[294px] mb-4 rounded-full overflow-hidden p-2">
              <img
                className="w-full h-full rounded-full object-cover border-2 border-neutral60"
                src={userInfo.imagePath}
                alt="User"
                style={{ objectFit: "cover" }}
                onMouseEnter={() => setEditImage(true)}
                onMouseLeave={() => setTimeout(() => setEditImage(false), 2000)}
              />
            </div>
            {editImage && !isSelectImageOpen && (
              <div
                className={`bg-neutral70 text-primary90 rounded-full absolute top-10 left-0 cursor-pointer p-2`}
                onClick={() => {
                  setIsSelectImageOpen(true);
                }}
              >
                <MdModeEdit size={30} style={{ zIndex: 100 }} />
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-neutral10 mb-4 font-moonjelly flex flex-col">
            {userInfo.name}
            <span className="text-lg text-primary80 font-poppins text-center hover:underline hover:cursor-pointer">
              @{userInfo.username}
            </span>
          </h1>
          <div className="flex justify-center lg:justify-start gap-8 mt-4 text-neutral10 font-poppins">
            <div>
              <p className="text-sm font-bold text-center">{userInfo.reviews}</p>
              <p className="text-sm">Reviews</p>
            </div>
            <div
              onClick={() => {
                setIsType("followers");
                fetchFollowers("followers");
              }}
              className="cursor-pointer"
            >
              <p className="text-sm font-bold text-center">{userInfo.followers}</p>
              <p className="text-sm">Seguidores</p>
            </div>
            <div
              onClick={() => {
                setIsType("followings");
                fetchFollowers("followings");
              }}
              className="cursor-pointer"
            >
              <p className="text-sm font-bold text-center">{userInfo.followings}</p>
              <p className="text-sm">Seguindo</p>
            </div>
          </div>
          <button
            className=" relative md:left-[-12px] w-[290px] mt-6 p-2 bg-neutral10 text-neutral80 rounded hover:bg-neutral20 transition duration-300"
            onClick={() => setIsEditProfileOpen(true)}
          >
            Edit Profile
          </button>
        </div>

        {/* Review Post and Reviews */}
        <div className="w-full lg:w-[100%] relative left-0 md:left-8 top-0 lg:top-32">
          {/* Review Post */}
          {width > 1024 && width < 1385 ? (
            <div className="w-full mb-6" style={{ zoom: "0.7" }}>
              <ReviewPost setIsPost={setIsPost} isPost={isPost} />
            </div>
          ) : (
            <div className=" relative w-full mb-6 right-[-1vw] md:right-12">
              <ReviewPost setIsPost={setIsPost} isPost={isPost} />
            </div>
          )}

          {/* Review Container */}
          <div className="relative left-8 md:left-0 w-full lg:w-[90%] space-y-12 mb-[16vh]">
            {userReview && userReview.length > 0 ? (
              userReview.map((review) => (
                <ReviewContainer
                  key={review.id}
                  reviewId={review.id}
                  selfProfile={true}
                  movieId={review.mediaId}
                  plataform={review.mediaType}
                  profileId={userInfo.username}
                  setDelete={setIsDelete}
                  deleted={isDelete}
                />
              ))
            ) : (
              <div className="flex items-center flex-col justify-center">
                <img src="/images/no-content.svg" alt="Sem conteúdo" className="w-[400px] h-[350px] mx-auto" />
                <p className="text-2xl font-bold text-neutral10 font-moonjelly">Nehuma Resenha Publicada!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals edit image profile */}
      {isSelectImageOpen && (
        <ProfileImageModal
          isSelectImageOpen={isSelectImageOpen}
          setIsSelectImageOpen={setIsSelectImageOpen}
          profileImage={profileImage}
          selectedProfileImage={selectedProfileImage}
          setSelectedProfileImage={setSelectedProfileImage}
          handleMore={handleMore}
          clickMore={clickMore}
          loading={loading}
          handleProfileImage={handleProfileImage}
      
        />
      )}

      {/* Modals edit banner */}
      {isSelectBannerOpen && (
        <BannerProfileModal
          isSelectBannerOpen={isSelectBannerOpen}
          setIsSelectBannerOpen={setIsSelectBannerOpen}
          profileImage={profileImage}
          selectedBanner={selectedBanner}
          setSelectedBanner={setSelectedBanner}
          handleMore={handleMore}
          clickMore={clickMore}
          loading={loading}
          handleProfileBanner={handleProfileBanner}
        />
      )}

      {/* Modal for Editing Profile */}
      {isEditProfileOpen && (
        <EditProfileModal
          isEditProfileOpen={isEditProfileOpen}
          setIsEditProfileOpen={setIsEditProfileOpen}
          userInfo={userInfo}
          setOnUpdate={setOnUpdate}
          setAlertWindow={setAlertWindow}
        />
      )}
      {showFollow && (
        <FollowList showFollow={showFollow} setShowFollow={setShowFollow} followers={followers} isType={isType} />
      )}
    </div>
  );
};
