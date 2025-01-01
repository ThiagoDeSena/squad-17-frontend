import React from "react";
import { TicketBanner } from "./TicketBanner";
import { MediaDetails } from "./MediaDetails";

export const MediaPage = ({id, type}) => {
    document.body.style.backgroundColor = '#191919'
    return(
        <>
            <div className="overflow-hidden lg:p-4">
                <TicketBanner mediaType={type} mediaId={id}/>
            </div>
            <div className="overflow-hidden">
                <MediaDetails mediaType={type} mediaId={id}/>
            </div>
        </>
    )
}