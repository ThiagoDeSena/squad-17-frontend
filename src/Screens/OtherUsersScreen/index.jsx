import React from "react";
import { SideBar } from "../../components/SideBar";
import { OutherUserPage } from "../../components/OutherUserPage";
import { useParams } from "react-router-dom";
export const OutherUserScreen = () => {
    document.body.style.backgroundColor = '#191919'
    const params = useParams();
    const userId = params.id

    return (
        <>
            <SideBar/>
            <OutherUserPage id={userId}/>
        </>
    
    )
};