import { useEffect, useState } from "react";
import { RecomendedCard } from "./RecomendedCard";
import { getSimilarMedia } from "../../../services/movieAPI";
import { FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
export const Recomended = ({ mt, title, viewMore }) => {
  const [recomended, setRecomended] = useState([]);
  const lastMedia = JSON.parse(localStorage.getItem("lastMedia")) || { type: "tv", id: 63174 };

  useEffect(() => {
    const fetchRecomended = async () => {
      try {
        const movies = await getSimilarMedia(lastMedia.type, lastMedia.id);
        setRecomended(movies);
      } catch (error) {
        console.error("Erro ao carregar filmes em tendência: ", error);
      }
    };

    fetchRecomended();
  }, [title]);

  return (
    <div className={`${mt} px-4 flex items-center justify-center`}>
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center mb-2 text-center font-moonjelly">
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-white md:mb-0">{title}</h2>
          {viewMore && (
            <button className="text-lg md:text-2xl flex items-center justify-center text-primary60 hover:text-primary40 transition hover:underline md:ml-4">
              Ver mais
              <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
        <Swiper
          spaceBetween={40}
          slidesPerView={3}
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 70, centeredSlides: true },
            640: { slidesPerView: 2, spaceBetween: 70, centeredSlides: true },
            768: { slidesPerView: 2, centeredSlides: true },
            1024: { slidesPerView: 3, centeredSlides: true },
            1280: { slidesPerView: 4, centeredSlides: true },
            1440: { slidesPerView: 5, centeredSlides: false },
          }}
          className="flex gap-2 justify-center items-center no-scrollbar mt-8"
        >
          {recomended.map(
            (movie) =>
              (movie.poster_path || movie.backdrop_path) && (
                <SwiperSlide key={movie.id}>
                  <RecomendedCard
                    image={`https://image.tmdb.org/t/p/w1280/${movie.poster_path || movie.backdrop_path}`}
                    title={movie.title || movie.name || "Título não disponível"}
                    genre={movie.genre_ids}
                    className="relative w-48 h-72 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-90 font-poppins"
                    id={movie.id}
                    type={movie.media_type}
                  />
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>
    </div>
  );
};
