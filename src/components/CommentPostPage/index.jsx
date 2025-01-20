import React, { useState } from "react";
import { ReviewContainer } from "../../components/FeedPage/Feed/ReviewContainer";
import { UserComment } from "./UserComment";

export const CommentPostPage = ({ postId }) => {
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState([
        {
            id: 1,
            profileImage: "/images/profile.png",
            profileName: "Jhon Nonyer",
            content: "Ótima resenha, adorei sua visão sobre o filme",
            timestamp: "2025-01-15T14:30:00",
            isOwner: false,
        },
        {
            id: 2,
            profileImage: "/images/profile.png",
            profileName: "Sophia Smith",
            content:
                "Eu achei que faltou mencionar a trilha sonora, que é incrível.",
            timestamp: "2025-01-15T14:30:00",
            isOwner: false,
        },
    ]);

    const MAX_CHARACTERS = 200;

    const handleAddComment = () => {
        if (!commentInput.trim()) return;

        const newComment = {
            id: comments.length + 1,
            profileImage: "/images/user-img2.png",
            profileName: "Você",
            content: commentInput,
            isOwner: true, // Apenas o proprietário verá o menu,
            timestamp: new Date().toISOString(),
            onCommentDelete: () => {console.log("Comment deleted");},
        };
        setComments([newComment, ...comments]);
        setCommentInput("");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARACTERS) {
            setCommentInput(value);
        }
    };

    return (
        <div className="flex flex-col relative left-[7vw] md:left-0 items-center p-4 min-h-screen max-w-5xl mx-auto font-poppins">
            {/* Componente da resenha */}
            <div className="flex flex-col items-center justify-center">
                <ReviewContainer
                    movieId={845781}
                    plataform="movie"
                    profileImage="/images/user-img2.png"
                    profileName="Ava Andersson"
                    profileId={1}
                />
                <div className="max-w-2xl w-auto md:w-full">
                    <h2 className="text-3xl font-semibold text-neutral10 mb-4">
                        Deixe seu comentário
                    </h2>
                    <div className="relative">
                        <textarea
                            value={commentInput}
                            onChange={handleInputChange}
                            placeholder="Escreva seu comentário..."
                            className="w-full h-56 p-6 border-none rounded-lg bg-neutral90 text-neutral10 placeholder-neutral10 focus:ring-2 focus:ring-primary40 focus:outline-none shadow-lg"
                            style={{ resize: "none" }}
                            rows={4}
                        />
                        <div className="absolute top-2 right-4 text-sm text-neutral20">
                            {commentInput.length}/{MAX_CHARACTERS}
                        </div>
                        <button
                            onClick={handleAddComment}
                            disabled={!commentInput.trim()}
                            className={`absolute bottom-4 left-4 px-6 py-2 rounded-lg shadow-md transition-all ${
                                commentInput.trim()
                                    ? "bg-primary40 text-white hover:bg-primary50"
                                    : "bg-neutral70 text-neutral30 cursor-not-allowed"
                            }`}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4 border-t border-2 border-neutral30 w-full"></div>
            {/* Lista de comentários */}
            <div className="mt-2 w-full p-6 rounded-lg mx-auto">
                <h2 className="text-4xl font-moonjelly mb-6 text-neutral10 text-center">
                    O que outros usuários disseram
                </h2>
                {comments.length === 0 ? (
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/empty.svg"
                            alt="empty"
                            className="w-1/3 mb-4"
                        />
                        <p className="text-neutral10 text-center">
                            Nenhum comentário ainda. Seja o primeiro a comentar!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <UserComment key={comment.id} {...comment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
