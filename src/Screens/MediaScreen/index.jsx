import React, { useEffect } from "react";
import { SideBar } from "../../components/SideBar";
import { MediaPage } from "../../components/MediaPage";
import { useParams } from "react-router-dom";

export const MediaScreen = () => {
    const paramns = useParams();
    const mediaId = paramns.id
    const mediaType = paramns.type
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [mediaId, mediaType]); 
    return (
        <>  
            <MediaPage type={mediaType} id={mediaId}/>
        </>
    )
}
