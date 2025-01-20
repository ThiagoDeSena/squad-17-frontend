import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";

export const UserComment = ({
    profileImage,
    profileName,
    content,
    timestamp,
    isOwner = false,
    onCommentDelete, // Callback para quando o comentário for deletado
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [commentContent, setCommentContent] = useState(content);

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - new Date(timestamp)) / 60000);

        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `${diffInHours} hours ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`;
        }
    };

    const MAX_CHARACTERS = 200;

    const handleEditChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARACTERS) {
            setEditedContent(value);
        }
    };

    const handleEdit = () => {
        setCommentContent(editedContent);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onCommentDelete();
    };

    return (
        <div className="flex gap-4 bg-neutral90 rounded-lg p-4 shadow-md mb-6 w-[95%] lg:w-3/4 mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300 relative border-l-4 border-primary30">
            {/* Imagem de perfil */}
            <div className="flex-shrink-0">
                <img
                    src={profileImage}
                    alt={`${profileName}'s profile`}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Conteúdo do comentário */}
            <div className="w-full">
                <div className="flex justify-start items-center space-x-4">
                    <p className="text-neutral10 font-semibold text-sm md:text-base hover:underline hover:cursor-pointer hover:text-primary70">
                        {profileName}
                    </p>
                    <p className="text-xs md:text-sm text-neutral50">
                        {getTimeAgo(timestamp)}
                    </p>
                </div>
                <p className="text-neutral20 text-sm md:text-base mt-2 leading-relaxed break-words max-w-[80%] max-h-[150px] overflow-y-auto">
                    {commentContent}
                </p>
            </div>

            {/* Mini-menu (apenas para o proprietário do comentário) */}
            {isOwner && (
                <div className="absolute top-3 right-4 z-20 font-poppins">
                    <button
                        onClick={() => setShowMenu((prev) => !prev)}
                        className="text-neutral50 hover:text-primary70 transition-colors"
                    >
                        <FiEdit />
                    </button>
                    {showMenu && (
                        <div className="absolute right-4 top-1  w-32 bg-neutral60 rounded shadow-lg">
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    setIsEditing(true);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-neutral10 hover:bg-neutral20 hover:text-semanticInfo"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    handleDelete();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-neutral10 hover:bg-neutral20 hover:text-semanticError"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de edição */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                    <div className="bg-gradient-to-r from-neutral70 to-neutral80 rounded-lg p-6 w-[80%] left-10 md:left-0 relative md:w-1/3">
                        <h2 className="text-lg font-semibold  mb-4 text-neutral10">
                            Edit Comment
                        </h2>
                        <div className="relative shadow-md">
                            <textarea
                                value={editedContent}
                                onChange={handleEditChange}
                                className="w-full h-40 bg-neutral90 text-neutral10  rounded-lg p-6 focus:outline-none focus:ring-2 focus:ring-primary70 resize-none"
                                rows={4}
                            ></textarea>
                            <div className="absolute top-1 right-2 text-sm text-neutral20">
                                {editedContent.length}/{MAX_CHARACTERS}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className={`bg-primary70 hover:bg-primary80 text-white px-4 py-2 rounded-lg ${
                                    !editedContent.length ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={!editedContent.length}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
