import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Loading } from "../Utils/Loading";
import { FaFilm, FaHeart, FaUsers } from "react-icons/fa";
import { getTopUsers } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";

const API_URL = "https://pixabay.com/api/";
const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;


export const TierRankPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUser, setTopUser] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopUser = async () => {
      try {
        const response = await getTopUsers();
        setTopUser(response);
      } catch (error) {
        throw error;
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}?key=${API_KEY}&q=movies&image_type=photo&per_page=3`);
        const data = await response.json();
        console.log(data);
        if (data.hits) {
          setImages(data.hits);
        }
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopUser();
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
        {topUser.map((user, index) => (
          <SwiperSlide key={user.id}>
            <div className="relative w-[300px] md:w-full h-full rounded-xl flex justify-center items-center font-poppins shadow-xl transition-transform transform hover:scale-95 mx-auto left-[6vw] md:left-0">
              {/* Background com blur */}
              <div
                className="absolute inset-0 bg-no-repeat bg-cover bg-center filter rounded-xl brightness-50"
                style={{
                  backgroundImage: `url(${images[index]?.largeImageURL || ""})`,
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
                  <p className="text-3xl font-moonjelly text-neutral10 relative right-12">{`#${index + 1}`}</p>
                  <img src={`./images/award${index + 1}st.svg`} alt={`Posição ${index + 1}ª`} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Foto do Usuário */}
                <img
                  src={user.image}
                  alt={user.username}
                  className={` cursor-pointer w-60 h-60 rounded-full border-4 ${
                    index === 0
                      ? "border-yellow-400"
                      : index === 1
                      ? "border-red-400"
                      : index === 2
                      ? "border-gray-400"
                      : "border-neutral10"
                  } shadow-lg mb-4`}
                  onClick={() => navigate(`/user/${user.username}`)}
                />

                {/* Nome do Usuário */}
                <h2 className="text-4xl font-moonjelly mb-4">{user.user ? " Você" : user.username}</h2>

                {/* Informações do Usuário */}
                <div className="text-lg space-y-2">
                  <p className="flex items-center gap-2 font-semibold">
                    <FaFilm className="text-yellow-400" size={30} /> Reviews: {user.reviewCount}
                  </p>
                  <p className="flex items-center gap-2 font-semibold">
                    <FaHeart className="text-red-500" size={30} /> Likes: {user.totalLikes}
                  </p>
                  <p className="flex items-center gap-2 font-semibold">
                    <FaUsers className="text-blue-400" size={30} /> Seguidores: {user.followCount}
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
