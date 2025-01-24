import React, { useEffect } from "react";
import { SideBar } from "../../components/SideBar";
import { OutherUserPage } from "../../components/OutherUserPage";
import { useParams } from "react-router-dom";
export const OutherUserScreen = () => {
    document.body.style.backgroundColor = "#191919";
    const params = useParams();
    const userId = params.id;
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [userId]);
    return (
        <>
            <OutherUserPage id={userId} />
        </>
    );
};
