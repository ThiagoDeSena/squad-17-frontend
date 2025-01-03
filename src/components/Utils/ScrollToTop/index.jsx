import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import Aos from "aos";
import "aos/dist/aos.css";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 300);
    };

    useEffect(() => {
        Aos.init({
            duration: 500,
            easing: "ease-in-out",
        });
    }, []);

    // Voltar ao topo
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 bg-primary60 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-primary80 transition duration-300 ease-in-out flex items-center justify-center z-50"
                data-aos={isVisible ? "fade-down-right" : "fade-down-left"}
                data-aos-duration={500}
                data-aos-easing="ease-in-out"
            >
                <FiArrowUp size={18} />
            </button>
        </>
    );
};

