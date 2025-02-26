import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { deleteComment, editComment, getCommentsById } from "../../../services/comments";
import { getUsersInfo } from "../../../services/userAPI";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export const UserComment = ({ commentId, userId, setIsDelete = false, isDelete = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [editedContent, setEditedContent] = useState("");
  const [comment, setComment] = useState({
    content: "",
    isOwner: false,
    dataCriacao: "",
  });
  const [userComment, setUserComment] = useState({
    name: "",
    imagePath: localStorage.getItem("profilePath") || "/images/profile.png",
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const [userResponse, commentResponse] = await Promise.all([getUsersInfo(userId), getCommentsById(commentId)]);
        setUserComment({
          name: userResponse.name,
          imagePath: userResponse.imagePath,
        });
        setComment({
          content: commentResponse.content,
          dataCriacao: commentResponse.dataCriacao,
          isOwner: commentResponse.isOwner,
          updatedAt: commentResponse.updatedAt,
        });
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    };
    fetchComments();
  }, []);

  const MAX_CHARACTERS = 200;

  const handleEditChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setEditedContent(value);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await editComment(commentId, editedContent);
      setComment({
        content: response.content,
        dataCriacao: response.dataCriacao,
        isOwner: response.isOwner,
        updatedAt: response.updatedAt,
      });
      setIsEditing(!isEditing);
      return response;
    } catch (error) {
      console.error("Erro ao editar comentario!", error);
    }
  };

  const handeDeleteComment = async () => {
    try {
      const response = await deleteComment(commentId);
      setIsDelete(!isDelete);
      return response;
    } catch (error) {
      console.error("Erro ao deletar comentario!", error);
    }
  };

  const formatDate = (date) => {
    return date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "";
  };

  const displayDate =
  comment.updatedAt || comment.dataCriacao
      ? new Date(comment.updatedAt) > new Date(comment.dataCriacao)
        ? comment.updatedAt
        : comment.dataCriacao   
      : "";

  return (
    <div className="flex gap-4 bg-neutral90 rounded-lg p-4 shadow-md mb-6 w-[95%] lg:w-3/4 mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300 relative border-l-4 border-primary30">
      {/* Imagem de perfil */}
      <div className="flex-shrink-0">
        <img
          src={userComment.imagePath}
          alt={`${userComment.name}'s profile`}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Conteúdo do comentário */}
      <div className="w-full">
        <div className="flex justify-start items-center space-x-4">
          <p className="text-neutral10 font-semibold text-sm md:text-base hover:underline hover:cursor-pointer hover:text-primary70" 
          onClick={() => navigate(`/user/${userId}`)}>
            {comment.isOwner ? "Você" : userComment.name}
          </p>
          <p className="text-xs md:text-sm text-neutral50">{comment.updatedAt ? "updated" : ""} {formatDate(displayDate)}{" "}</p>
        </div>
        <p className="text-neutral20 text-sm md:text-base mt-2 leading-relaxed break-words max-w-[80%] max-h-[150px] overflow-y-auto">
          {comment.content}
        </p>
      </div>

      {comment.isOwner && (
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
                  setEditedContent(comment.content);
                }}
                className="w-full text-left px-4 py-2 text-sm text-neutral10 hover:bg-neutral20 hover:text-semanticInfo"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handeDeleteComment(commentId);
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
            <h2 className="text-lg font-semibold  mb-4 text-neutral10">Edit Comment</h2>
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
