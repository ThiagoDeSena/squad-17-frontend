import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Loading } from "../Utils/Loading";
import { FaFilm, FaHeart, FaUsers } from "react-icons/fa";

const API_URL = "https://pixabay.com/api/";
const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

const mockUsers = [
    {
        id: 1,
        name: "João Silva",
        profileImage:
            "https://res.cloudinary.com/dg9hqvlas/image/upload/v1736533356/339_-_RGPayKA_kxdqhi.png",
        reviews: 150,
        likes: 320,
        followers: 500,
    },
    {
        id: 2,
        name: "Maria Oliveira",
        profileImage:
            "https://res.cloudinary.com/dg9hqvlas/image/upload/v1736533473/8_-_ih6xvXa_cgmkr8.png",
        reviews: 120,
        likes: 290,
        followers: 450,
    },
    {
        id: 3,
        name: "Pedro Almeida",
        profileImage:
            "https://res.cloudinary.com/dg9hqvlas/image/upload/v1736533468/352_-_roiEThv_eczyqh.png",
        reviews: 100,
        likes: 250,
        followers: 300,
    },
];

export const TierRankPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(
                    `${API_URL}?key=${API_KEY}&q=movies&image_type=photo`
                );
                const data = await response.json();
                if (data.hits) {
                    setImages(data.hits.slice(0, mockUsers.length));
                }
            } catch (error) {
                console.error("Erro ao buscar imagens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-neutral90 min-h-screen py-10 px-4 lg:px-20">
            <h1 className="text-4xl font-bold text-center mbhv-8 text-yellow-400 drop-shadow-lg mb-4 mx-auto relative  left-[6vw] md:left-0 font-moonjelly">
                ⭐ Melhores Usuários ⭐
            </h1>
            <Swiper
                slidesPerView={1}
                effect={"coverflow"}
                grabCursor={true}
                loop={false}
                spaceBetween={100}
                centeredSlides={true}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="w-screen h-[80vh]"
            >
                {mockUsers.map((user, index) => (
                    <SwiperSlide key={user.id}>
                        <div className="relative w-[300px] md:w-full h-full rounded-xl flex justify-center items-center font-poppins shadow-xl transition-transform transform hover:scale-95 mx-auto left-[6vw] md:left-0">
                            {/* Background com blur */}
                            <div
                                className="absolute inset-0 bg-no-repeat bg-cover bg-center filter rounded-xl brightness-50"
                                style={{
                                    backgroundImage: `url(${
                                        images[index]?.largeImageURL || ""
                                    })`,
                                }}
                            ></div>

                            {/* Informações do Usuário */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/90 flex flex-col justify-center items-center text-white text-center p-4 rounded-xl z-10">
                                {/* Posição do Usuário */}
                                <div
                                    className={`absolute top-4 left-4 ${
                                        index === 0
                                            ? "bg-yellow-400"
                                            : index === 1
                                            ? "bg-red-400"
                                            : index === 2
                                            ? "bg-gray-400"
                                            : "bg-white"
                                    } text-neutral90 text-lg font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg`}
                                >
                                    <img
                                        src={`./images/award${index + 1}st.svg`}
                                        alt={`Posição ${index + 1}ª`}
                                        loading="lazy"
                                    />
                                </div>

                                {/* Foto do Usuário */}
                                <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className={`w-60 h-60 rounded-full border-4 ${
                                        index === 0
                                            ? "border-yellow-400"
                                            : index === 1
                                            ? "border-red-400"
                                            : index === 2
                                            ? "border-gray-400"
                                            : "border-neutral10"
                                    } shadow-lg mb-4`}
                                />

                                {/* Nome do Usuário */}
                                <h2 className="text-4xl font-moonjelly mb-4">
                                    {user.name}
                                </h2>

                                {/* Informações do Usuário */}
                                <div className="text-lg space-y-2">
                                    <p className="flex items-center gap-2 font-semibold">
                                        <FaFilm
                                            className="text-yellow-400"
                                            size={30}
                                        />{" "}
                                        Reviews: {user.reviews}
                                    </p>
                                    <p className="flex items-center gap-2 font-semibold">
                                        <FaHeart
                                            className="text-red-500"
                                            size={30}
                                        />{" "}
                                        Likes: {user.likes}
                                    </p>
                                    <p className="flex items-center gap-2 font-semibold">
                                        <FaUsers
                                            className="text-blue-400"
                                            size={30}
                                        />{" "}
                                        Seguidores: {user.followers}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
