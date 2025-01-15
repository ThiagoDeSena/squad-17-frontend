import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Modal from "react-modal";
import { ReviewPost } from "../FeedPage/ReviewPost";
import { ReviewContainer } from "../FeedPage/Feed/ReviewContainer";
import { MdModeEdit } from "react-icons/md";
import { fetchFileImage } from "../../services/image";
import { Loading } from "../Utils/Loading";
import { FaPlus } from "react-icons/fa";
import { AlertWindow } from "../Utils/AlertWindow";

const userInfo = {
    name: "Clack Crente",
    email: "bB2qH@example.com",
    image: localStorage.getItem("profilePath") || "/images/profile.png",
    banner: localStorage.getItem("bannerPath") || "/images/user-banner.png",
    reviewsCount: 10,
    followersCount: 5,
    followingCount: 3,
    followers: ["2", "3"],
};
Modal.setAppElement("#root");

export const UserPage = () => {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [editBanner, setEditBanner] = useState(false);
    const [isSelectImageOpen, setIsSelectImageOpen] = useState(false);
    const [isSelectBannerOpen, setIsSelectBannerOpen] = useState(false);
    const [selectedProfileImage, setSelectedProfileImage] = useState(
        userInfo.image
    );
    const [selectedBanner, setSelectedBanner] = useState(userInfo.banner);
    const [clickMore, setClickMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState({
        profileImages: [],
        next_cursor: null,
    });

    const [alertWindow, setAlertWindow] = useState({});
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
                    ...resources.filter(
                        (newItem) =>
                            !prev.profileImages.some(
                                (item) => item.asset_id === newItem.asset_id
                            )
                    ),
                ],
                next_cursor,
            }));
        } catch (error) {
            console.error("Failed to load images", error);
        } finally {
            setClickMore(false);
        }
    };

    const handleProfileImage = (selected) => {
        if (selected !== localStorage.getItem("profilePath")) {
            localStorage.setItem("profilePath", selected);
            setAlertWindow({
                message: "Profile image updated successfully!",
                type: "success",
            });
            setTimeout(() => window.location.reload(), 2000);
        } else {
            setAlertWindow({
                message: "Select profile Image!",
                type: "error",
            });
        }
    };

    const handleProfileBanner = (selected) => {
        if (selected !== localStorage.getItem("bannerPath")) {
            localStorage.setItem("bannerPath", selected);
            setAlertWindow({
                message: "Banner image updated successfully!",
                type: "success",
            });
            setTimeout(() => window.location.reload(), 2000);
        } else {
            setAlertWindow({
                message: "Select Banner Image!",
                type: "error",
            });
        }
    }

    const [width, setWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return (
        <div className="relative w-full mx-auto top-0 flex flex-col overflow-hidden">
            {alertWindow.message && (
                <AlertWindow
                    message={alertWindow.message}
                    type={alertWindow.type}
                />
            )}
            {/* Banner Section */}
            <div
                className="banner bg-cover bg-center h-[465px] w-full rounded-lg absolute object-cover"
                style={{ backgroundImage: `url(${userInfo.banner})` }}
                onMouseEnter={() => setEditBanner(true)}
                onMouseLeave={() =>
                    setTimeout(() => setEditBanner(false), 2000)
                }
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
                                className="w-full h-full rounded-full object-cover border-2 border-primary30"
                                src={userInfo.image}
                                alt="User"
                                style={{ objectFit: "cover" }}
                                onMouseEnter={() => setEditImage(true)}
                                onMouseLeave={() =>
                                    setTimeout(() => setEditImage(false), 2000)
                                }
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

                    <h1 className="text-4xl md:text-5xl font-bold text-neutral10 mb-4 font-moonjelly">
                        {userInfo.name}
                    </h1>
                    <div className="flex justify-center lg:justify-start gap-8 mt-4 text-neutral10 font-poppins">
                        <div>
                            <p className="text-sm font-bold text-center">
                                {userInfo.reviewsCount}
                            </p>
                            <p className="text-sm">Reviews</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-center">
                                {userInfo.followersCount}
                            </p>
                            <p className="text-sm">Followers</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-center">
                                {userInfo.followingCount}
                            </p>
                            <p className="text-sm">Following</p>
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
                            <ReviewPost />
                        </div>
                    ) : (
                        <div className=" relative w-full mb-6 right-[-1vw] md:right-12">
                            <ReviewPost />
                        </div>
                    )}

                    {/* Review Container */}
                    <div className="relative left-8  md:left-0 w-full lg:w-[90%]  space-y-6">
                        <ReviewContainer
                            movieId={239770}
                            plataform="tv"
                            profileImage={userInfo.image}
                            profileName={userInfo.name}
                        />
                        <ReviewContainer
                            movieId={93405}
                            plataform="tv"
                            profileImage={userInfo.image}
                            profileName={userInfo.name}
                        />
                        <ReviewContainer
                            movieId={939243}
                            plataform="movie"
                            profileImage={userInfo.image}
                            profileName={userInfo.name}
                        />
                        <ReviewContainer
                            movieId={426063}
                            plataform="movie"
                            profileImage={userInfo.image}
                            profileName={userInfo.name}
                        />
                    </div>
                </div>
            </div>

            {/* Modals edit image profile */}
            {isSelectImageOpen && (
                <Modal
                    isOpen={isSelectImageOpen}
                    onRequestClose={() => setIsSelectImageOpen(false)}
                    className="bg-neutral80 p-4 rounded-xl h-auto w-[95%] max-w-lg shadow-lg"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    contentLabel="Select Profile Image"
                    style={{ overlay: { zIndex: 2002 } }}
                >
                    <div className="flex flex-col items-center max-h-[80vh] overflow-y-auto font-poppins">
                        <h2 className="text-3xl font-bold text-neutral10 mb-6 text-center font-moonjelly">
                            Select Profile Image
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-3 h-full overflow-auto max-w-full p-2">
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loading />
                                </div>
                            ) : profileImage.profileImages.length > 0 ? (
                                profileImage.profileImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        loading="lazy"
                                        className={`w-20 h-20 rounded-full cursor-pointer border-2 transition duration-300 ${
                                            selectedProfileImage === img.url
                                                ? "border-primary40 border-4 scale-105"
                                                : "border-neutral30 hover:border-primary20"
                                        }`}
                                        onClick={() => {
                                            if (
                                                selectedProfileImage === img.url
                                            ) {
                                                setSelectedProfileImage(null);
                                            } else {
                                                setSelectedProfileImage(
                                                    img.url
                                                );
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-neutral60">
                                    No images available
                                </p>
                            )}
                            {profileImage.profileImages.length > 0 &&
                                !loading && (
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="mt-6 px-6 py-2 bg-primary30 text-white rounded-lg hover:bg-primary20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() =>
                                                handleMore(selectedProfileImage)
                                            }
                                            disabled={clickMore}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                )}
                        </div>
                        <button
                            className="mt-6 w-full px-6 py-2 bg-primary40 text-white rounded-lg hover:bg-primary60 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                                handleProfileImage(selectedProfileImage)
                            }
                            disabled={clickMore}
                        >
                            Confirm
                        </button>
                    </div>
                </Modal>
            )}

            {/* Modals edit banner */}
            {isSelectBannerOpen && (
                <Modal
                    isOpen={isSelectBannerOpen}
                    onRequestClose={() => setIsSelectBannerOpen(false)}
                    className="bg-neutral80 p-8 rounded-xl h-auto w-[100%] max-w-2xl shadow-lg"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    contentLabel="Select Banner"
                    style={{ overlay: { zIndex: 9999 } }}
                >
                    <div className="flex flex-col items-center max-h-[80vh] w-[100%] overflow-y-auto font-poppins">
                        <h2 className="text-3xl font-bold text-neutral10 font-moonjelly mb-6">
                            Select Banner
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 h-full overflow-auto max-w-full p-2">
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loading />
                                </div>
                            ) : profileImage.profileImages.length > 0 ? (
                                profileImage.profileImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        className={`w-full h-28 rounded-xl cursor-pointer border-2 transition duration-300 transform hover:scale-105 ${
                                            selectedBanner === img.url
                                                ? "border-primary40 border-4 scale-105"
                                                : "border-neutral30 hover:border-primary20"
                                        } shadow-lg hover:shadow-xl`}
                                        onClick={() => {
                                            if (
                                                selectedBanner === img.url
                                            ) {
                                                setSelectedBanner(null);
                                            } else {
                                                setSelectedBanner(
                                                    img.url
                                                );
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-neutral60">
                                    No images available
                                </p>
                            )}
                            {profileImage.profileImages.length > 0 &&
                                !loading && (
                                    <div className="flex items-center justify-left">
                                        <button
                                            className="mt-6 px-6 py-2 bg-primary30 text-white rounded-lg hover:bg-primary20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() =>
                                                handleMore(selectedProfileImage)
                                            }
                                            disabled={clickMore}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                )}
                        </div>
                        <button
                            className="mt-6 px-6 py-2 bg-primary40 text-white rounded-lg hover:bg-primary60 transition duration-300"
                            onClick={() => handleProfileBanner(selectedBanner)}
                        >
                            Confirm
                        </button>
                    </div>
                </Modal>
            )}

            {/* Modal for Editing Profile */}
            {isEditProfileOpen && (
                <Modal
                    isOpen={isEditProfileOpen}
                    onRequestClose={() => setIsEditProfileOpen(false)}
                    className="bg-neutral10 p-8 rounded-xl h-auto  w-[90%] max-w-lg shadow-lg"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    contentLabel="Edit Profile"
                    style={{ overlay: { zIndex: 9999 } }}
                >
                    <div className="flex flex-col items-center relative">
                        <h2 className="text-3xl border-b-2 border-primary30 font-bold text-neutral90 mb-6">
                            Edit Profile
                        </h2>
                        <form className="w-full space-y-5">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral70 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={userInfo.name}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral70 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral70 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter a new password"
                                    className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-neutral50 mt-1">
                                    Password must be at least 8 characters long.
                                </p>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral70 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm your new password"
                                    className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center space-x-4 ">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary40 text-white rounded-lg hover:bg-primary60 transition duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>

                        {/* Close Button */}
                        <button
                            className="absolute top-0 right-4 text-semanticError hover:text-neutral70 transition duration-300"
                            onClick={() => setIsEditProfileOpen(false)}
                        >
                            <IoCloseSharp size={34} />
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
