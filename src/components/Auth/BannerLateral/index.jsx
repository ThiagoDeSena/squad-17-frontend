import React, { useEffect } from "react";
import AOS from 'aos'
import 'aos/dist/aos.css'
export const BannerLateral = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000,
            easing: 'ease-in-out'
        })
    }, []);

    return (
        <div className="w-[50vw] h-screen overflow-hidden">
            <div
                className="bg-[url('/images/banner-auth.png')] bg-no-repeat bg-center bg-cover h-[100%] w-[100%] "
                data-aos = 'slide-right'
            ></div>
        </div>

    )
};

