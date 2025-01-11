import React from "react";
import { SearchPage } from "../../components/SearchPage";
import { SideBar } from "../../components/SideBar";

export const SearchScreen = () => {
    document.body.style.background = "#191919"
    return (
        <>
            <SideBar/>
            <div className="overflow-hidden"><SearchPage/></div>
        </>
    );
};