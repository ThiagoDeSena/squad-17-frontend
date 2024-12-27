import React, { useState } from "react";
import { ReviewContainer } from "../FeedPage/Feed/ReviewContainer";

const ficticieUser = {
    id: 1,
    name: "Ava Andersson",
    email: "bB2qH@example.com",
    image: "/images/user-img2.png",
    banner: "/images/user-banner2.png",
    reviewsCount: 10,
    followersCount: "101K",
    followingCount: "11K",
    followers: ["2", "3"],
};

export const OutherUserPage = ({ id }) => {
    const [currentTab, setCurrentTab] = useState("recent"); // "recent" or "top"
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <div className="relative w-full lg:w-[90%] mx-auto top-0 flex flex-col">
            {/* Banner Section */}
            <div
                className="banner bg-cover bg-center h-[344px] w-full rounded-lg absolute"
                style={{ backgroundImage: `url(${ficticieUser.banner})` }}
            ></div>

            <div className="relative z-10 flex flex-col lg:flex-row mt-[200px] gap-2">
                {/* User Image and Info */}
                <div className="w-full lg:w-[40%] text-center flex flex-col items-center lg:items-start relative left-8 md:left-12">
                    <div className="relative">
                        <div className="w-[250px] lg:w-[294px] h-[250px] lg:h-[294px] mb-4 rounded-full overflow-hidden border-4 border-primary30 hover:scale-105 ease-linear duration-300">
                            <img
                                className="w-full h-full object-cover"
                                src={ficticieUser.image}
                                alt="User"
                            />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-neutral10 mb-4 font-moonjelly">
                        {ficticieUser.name}
                    </h1>
                    <div className="flex justify-center lg:justify-start gap-8 mt-4 text-neutral10 font-poppins">
                        <div>
                            <p className="text-sm font-bold text-center">
                                {ficticieUser.reviewsCount}
                            </p>
                            <p className="text-sm">Reviews</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-center">
                                {ficticieUser.followersCount}
                            </p>
                            <p className="text-sm">Followers</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-center">
                                {ficticieUser.followingCount}
                            </p>
                            <p className="text-sm">Following</p>
                        </div>
                    </div>
                    <button
                        className={`relative md:left-[-12px] w-[290px] mt-6 p-2 rounded transition duration-300 ${
                            isFollowing
                                ? "bg-neutral10 text-neutral80 hover:bg-neutral20"
                                : " bg-primary40 text-white hover:bg-primary30"
                        }`}
                        onClick={handleFollowToggle}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                </div>

                {/* Reviews Section */}
                <div className="w-full lg:w-[100%] relative left-0 md:left-8 top-0 lg:top-40">
                    {/* Tabs */}
                    <div className="flex justify-evenly  mt-12 lg:justify-start gap-4 mb-6 text-neutral10 font-poppins">
                        <button
                            className={`px-4 py-2 rounded-lg ${
                                currentTab === "recent"
                                    ? "bg-primary40 text-white"
                                    : "bg-neutral10 text-neutral80 hover:bg-neutral20"
                            }`}
                            onClick={() => setCurrentTab("recent")}
                        >
                            {window.innerWidth > 768 ? "Most Recent" : "Recent"}
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${
                                currentTab === "top"
                                    ? "bg-primary40 text-white"
                                    : "bg-neutral10 text-neutral80 hover:bg-neutral20"
                            }`}
                            onClick={() => setCurrentTab("top")}
                        >
                            {window.innerWidth > 768 ? "Top Reviews" : "Top"}
                        </button>
                    </div>

                    {/* Review Container */}
                    <div className="relative left-8 md:left-0 w-full lg:w-[90%] space-y-6">
                        {currentTab === "recent" && (
                            <>
                                <ReviewContainer
                                    movieId={239770}
                                    plataform="tv"
                                    profileImage={ficticieUser.image}
                                    profileName={ficticieUser.name}
                                />
                                <ReviewContainer
                                    movieId={93405}
                                    plataform="tv"
                                    profileImage={ficticieUser.image}
                                    profileName={ficticieUser.name}
                                />
                            </>
                        )}
                        {currentTab === "top" && (
                            <>
                                <ReviewContainer
                                    movieId={939243}
                                    plataform="movie"
                                    profileImage={ficticieUser.image}
                                    profileName={ficticieUser.name}
                                />
                                <ReviewContainer
                                    movieId={426063}
                                    plataform="movie"
                                    profileImage={ficticieUser.image}
                                    profileName={ficticieUser.name}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
