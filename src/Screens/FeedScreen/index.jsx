import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import {TrendingBanner} from "../../components/FeedPage/TrendingBanner";
import { Recomended } from "../../components/FeedPage/Recomended";
import { ReviewPost } from "../../components/FeedPage/ReviewPost";
import { Feed } from "../../components/FeedPage/Feed";

export const FeedScreen = () => {
    document.body.style.backgroundColor = '#191919'
    const [isPost, setIsPost] = useState(false);
    return (
        <>  
            <div className="overflow-hidden">
                <TrendingBanner/>
                <Recomended mt={'mt-20'} title={"Recomendado para você"} viewMore={true}/>
                <ReviewPost setIsPost={setIsPost} />
                <Feed isPost={isPost}/>
            </div>
        </>
    )
}