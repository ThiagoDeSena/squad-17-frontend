import React from "react";
import { UserPage } from "../../components/UserPage";
import { SideBar } from "../../components/SideBar";
import { useParams } from "react-router-dom";

export const UserScreen = () => {
    document.body.style.backgroundColor = '#191919'
    return (
        <>
            <SideBar/>
            <UserPage/>
        </>
    );
};
