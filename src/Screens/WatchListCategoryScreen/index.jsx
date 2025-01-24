import React from "react";
import {WatchlistCategoryPage} from "../../components/Watchlist/WatchlistCategoryPage";
import { useParams } from "react-router-dom";
import { SideBar } from "../../components/SideBar";

export const WatchlistCategoryScreen = () => {
    const params = useParams();
    const category = params.category
    return (
        <>
        <WatchlistCategoryPage category={category} />
        </>
    )   
}