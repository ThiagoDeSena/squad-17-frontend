import React from "react";
import { CommentPostPage } from "../../components/CommentPostPage";
import { useParams } from "react-router-dom";
import { SideBar } from "../../components/SideBar";

export const CommentPostScreen = () => {
    const paramns = useParams();
    const postId = paramns.id;

    document.body.style.backgroundColor = "#191919";

    return (
        <>
            <SideBar />
            <div className="overflow-hidden">
                <CommentPostPage postId={postId} />
            </div>
        </>
    );
};
