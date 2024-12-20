import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import {
    AiOutlineSetting,
    AiOutlineQuestionCircle,
    AiOutlineBell,
} from "react-icons/ai";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FiGrid, FiBookmark, FiBookOpen, FiStar } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const menuItems = [
        { name: "Feed", path: "/home", icon: <FiGrid size={28} /> },
        {
            name: "Watchlist",
            path: "/watchlist",
            icon: <FiBookmark size={28} />,
        },
        { name: "Blog", path: "/blog", icon: <FiBookOpen size={28} /> },
        {
            name: "Tier Rank",
            path: "/tier-rank",
            icon: <FiStar size={28} color="#FFD700" />,
        },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {isOpen ? (
                ""
            ): (
                <div
                    className="bg-[#191919] border-r border-neutral60 p-4 w-100px h-screen absolute top-0 left-0 z-50"
                ></div>
            ) }

            <div id="outer-container">
                <div
                    onClick={toggleMenu}
                    className={`absolute top-32 ${
                        isOpen ? "left-72" : "left-4"
                    } p-2 border-l-2 border-neutral60 rounded-xl cursor-pointer bg-black`}
                    style={{
                        zIndex: 9999,
                        transition: "left 0.4s ease-in-out",
                    }}
                >
                    {isOpen ? (
                        <FaAngleLeft size={28} color="#D9D9D9" />
                    ) : (
                        <FaAngleRight size={28} color="#D9D9D9" />
                    )}
                </div>

                <Menu
                    isOpen={isOpen}
                    onStateChange={({ isOpen }) => {
                        if (isOpen === false && !isOpen) {
                            setIsOpen(false);
                        }
                    }}
                    pageWrapId={"page-wrap"}
                    outerContainerId={"outer-container"}
                    customBurgerIcon={false}
                    customCrossIcon={false}
                    disableOverlayClick={() => true}
                    className="border-r border-neutral60"
                    styles={{
                        bmMenuWrap: {
                            height: "100%",
                        },

                        bmMenu: {
                            background: "#191919",
                            padding: "2em 1.5em",
                            fontSize: "1.15em",
                            transition: "transform 0.4s ease-in-out",
                        },
                        bmItemList: { color: "#fff" },
                    }}
                >
                    <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-center py-4 mb-10">
                            <a href="/">
                                <img
                                    src="/images/logo.svg"
                                    alt="Critix Logo"
                                    className="w-36 h-36"
                                />
                            </a>
                        </div>
                        <nav className="flex flex-col gap-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-4 p-3 rounded-xl text-xl font-poppins transition-colors hover:bg-gray-700 ${
                                        location.pathname === item.path
                                            ? "border-l-8 border-primary60 text-primary60 text-bold"
                                            : ""
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}

                            <hr className="border-gray-700 my-4" />
                            <Link
                                to="/help"
                                className="flex items-center gap-4 p-3 rounded-xl text-xl font-poppins transition-colors hover:bg-gray-700"
                            >
                                <AiOutlineQuestionCircle
                                    size={28}
                                    className="text-xl"
                                />
                                Help
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center gap-4 p-3 rounded-xl text-xl font-poppins transition-colors hover:bg-gray-700"
                            >
                                <AiOutlineSetting
                                    size={28}
                                    className="text-xl"
                                />
                                Setting
                            </Link>
                        </nav>

                        {/* User Section */}
                        <div className="flex items-center gap-4 p-2 rounded-full border border-gray-500 hover:border-primary90 cursor-pointer absolute bottom-2">
                            <div className="border border-primary60 p-1 rounded-full">
                                <img
                                    src="/images/user-img.jpeg"
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                            <span className="flex-1">Klark Crente</span>
                            <Link to="/notifications">
                                <AiOutlineBell size={28} color="#FFD700" />
                            </Link>
                        </div>
                    </div>
                </Menu>
            </div>
        </>
    );
};
