import React from "react";
import { SideBar } from "../../components/FeedPage/SideBar";
import {TrendingBanner} from "../../components/FeedPage/TrendingBanner";
import { Recomended } from "../../components/FeedPage/Recomended";

export const FeedScreen = () => {
    document.body.style.backgroundColor = '#191919'
    return (
        <>  
            <SideBar/>
            <TrendingBanner/>
            <Recomended/>
        </>
    )
}