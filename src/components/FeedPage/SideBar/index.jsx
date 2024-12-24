import React, { useState, useEffect } from "react";
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
    const [showToggle, setShowToggle] = useState(false);
    const menuItems = [
        { name: "Feed", path: "/feed", icon: <FiGrid size={28} /> },
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToggle(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isOpen ? (
                ""
            ) : (
                <div className="bg-[#191919] border-r border-neutral60 p-4 w-[70px] h-screen fixed top-0 left-0 z-50 flex flex-col items-center justify-center space-y-4 text-white">
                    <div className=" absolute top-0 flex items-center justify-center py-4 mb-10">
                        <a href="/">
                            <img
                                src="/images/logo.svg"
                                alt="Critix Logo"
                                className="w-16 h-16"
                            />
                        </a>
                    </div>
                    <nav className="flex flex-col gap-4 justify-center">
                        {menuItems.map((item) => (
                            <div className="relative flex items-center group">
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center justify-center gap-4 p-3 rounded-xl text-xl transition-colors hover:bg-gray-700 hover:scale-105 ${
                                        location.pathname === item.path
                                            ? "border-l-8 border-primary60 text-primary60 font-bold"
                                            : ""
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                </Link>
                                <span className="absolute left-full ml-2 hidden text-sm text-white bg-gray-800 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-in-out w-20">
                                    {item.name}
                                    <span className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></span>
                                </span>
                            </div>
                        ))}

                        <hr className="border-neutral30 my-4" />
                        <div className="relative flex items-center group">
                            <Link
                                to="/help"
                                className="flex items-center justify-center gap-4 p-3 rounded-xl text-xl font-poppins transition-colors hover:bg-gray-700 hover:scale-105"
                            >
                                <AiOutlineQuestionCircle
                                    size={28}
                                    className="text-xl"
                                />
                            </Link>
                            <span className="absolute left-full ml-2 hidden text-sm text-white bg-gray-800 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-in-out">
                                Help
                                <span className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></span>
                            </span>
                        </div>

                        <div className="relative flex items-center group">
                            <Link
                                to="/settings"
                                className="flex items-center justify-center gap-4 p-3 rounded-xl text-xl font-poppins transition-colors hover:bg-gray-700 hover:scale-105"
                            >
                                <AiOutlineSetting
                                    size={28}
                                    className="text-xl"
                                />
                            </Link>
                            <span className="absolute left-full ml-2 hidden text-sm text-white bg-gray-800 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-in-out">
                                Settings
                                <span className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></span>
                            </span>
                        </div>

                        <Link to="/profile">
                            <div className="border border-primary60 p-1 rounded-full absolute bottom-2">
                                <img
                                    src="/images/user-img.jpeg"
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                        </Link>
                    </nav>
                </div>
            )}

            <div id="outer-container">
                {showToggle && (
                    <div
                        onClick={toggleMenu}
                        className={`fixed top-32 ${
                            isOpen ? "left-72" : "left-12"
                        } p-2 border-l-2 border-neutral60 rounded-xl cursor-pointer bg-black`}
                        style={{
                            zIndex: 2000,
                            transition: "left 0.4s ease-in-out",
                        }}
                    >
                        {isOpen ? (
                            <FaAngleLeft size={28} color="#D9D9D9" />
                        ) : (
                            <FaAngleRight size={28} color="#D9D9D9" />
                        )}
                    </div>
                )}

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
                        bmOverlay: {
                            display: "none",
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

                        <div className="flex items-center gap-4 p-2 rounded-full border border-gray-500 hover:border-primary90 cursor-pointer absolute bottom-2">
                            <Link to={"/profile"}>
                                <div className="border border-primary60 p-1 rounded-full">
                                    <img
                                        src="/images/user-img.jpeg"
                                        alt="User Avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                </div>
                            </Link>
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
