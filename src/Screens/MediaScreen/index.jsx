import React from "react";
import { SideBar } from "../../components/SideBar";
import { MediaPage } from "../../components/MediaPage";
import { useParams } from "react-router-dom";

export const MediaScreen = () => {
    const paramns = useParams();
    const mediaId = paramns.id
    const mediaType = paramns.type
    return (
        <>  
            <SideBar/>
            <MediaPage type={mediaType} id={mediaId}/>
        </>
    )
}