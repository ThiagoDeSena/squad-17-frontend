import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Modal from "react-modal";
import { ReviewPost } from "../FeedPage/ReviewPost";
import { ReviewContainer } from "../FeedPage/Feed/ReviewContainer";
import { MdModeEdit } from "react-icons/md";

Modal.setAppElement("#root");

export const UserPage = () => {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [editBanner, setEditBanner] = useState(false);
    const userInfo = {
        name: "Clack Crente",
        email: "bB2qH@example.com",
        image: "/images/user-img.jpeg",
        banner: "/images/user-banner.png",
        reviewsCount: 10,
        followersCount: 5,
        followingCount: 3,
        followers: ["2", "3"],
    };
    const [width, setWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return (
        <div className="relative w-full lg:w-[90%] mx-auto top-0 flex flex-col overflow-hidden">
            {/* Banner Section */}
            <div
                className="banner bg-cover bg-center h-[344px] w-full rounded-lg absolute"
                style={{ backgroundImage: `url(${userInfo.banner})` }}
                onMouseDown={() => setEditBanner(!editBanner)}
            >
                {editBanner && (
                    <div className="absolute  mt-4 md:bottom-4 right-4 flex items-center gap-2 bg-primary40 text-neutral10 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-primary30 transition duration-300"
                    style={{ zIndex: 100 }}
                    >
                        <MdModeEdit size={20} />
                        <p className="text-sm font-semibold">
                            Edit Cover
                        </p>
                    </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row mt-[200px] gap-2">
                {/* User Image and Info */}
                <div className="w-full lg:w-[40%] text-center flex flex-col items-center lg:items-start relative left-8 md:left-12">
                    <div className="relative">
                        <div className="w-[250px] lg:w-[294px] h-[250px] lg:h-[294px] mb-4 rounded-full overflow-hidden border-4 border-primary30">
                            <img
                                className="w-full h-full object-cover"
                                src={userInfo.image}
                                alt="User"
                                onMouseDown={() => setEditImage(!editImage)}
                            />
                        </div>
                        <div
                            className={`bg-neutral70 text-primary90 rounded-full absolute top-10 left-0 cursor-pointer p-2 ${
                                editImage ? "block" : "hidden"
                            }`}
                        >
                            <MdModeEdit
                                size={30}
                                onClick={() => setIsEditProfileOpen(true)}
                                style={{ zIndex: 100 }}
                            />
                        </div>
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
                    {width > 1024  && width < 1385 ? (
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
                            profileImage="/images/user-img.jpeg"
                            profileName={userInfo.name}
                        />
                        <ReviewContainer
                            movieId={93405}
                            plataform="tv"
                            profileImage="/images/user-img.jpeg"
                            profileName={userInfo.name}
                        />
                        <ReviewContainer
                            movieId={939243}
                            plataform="movie"
                            profileImage="/images/user-img.jpeg"
                            profileName={userInfo.name}
                        />
                        <ReviewContainer
                            movieId={426063}
                            plataform="movie"
                            profileImage="/images/user-img.jpeg"
                            profileName={userInfo.name}
                        />
                    </div>
                </div>
            </div>

            {/* Modal for Editing Profile */}
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
        </div>
    );
};
