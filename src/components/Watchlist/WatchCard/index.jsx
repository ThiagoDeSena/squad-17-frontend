import { useEffect, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMediaDetails } from "../../../services/movieAPI";
import { RotateSpinner } from "react-spinners-kit";
import { FaTrash } from "react-icons/fa"

export const WatchCard = forwardRef(({ id, mediaType, className,onRemove, ...props }, ref) => {
    const [mediaData, setMediaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMediaData = async () => {
            try {
                setLoading(true);
                const response = await getMediaDetails(mediaType, id);
                setMediaData(response);
            } catch (err) {
                setError("Erro ao carregar dados da mídia.");
            } finally {
                setLoading(false);
            }
        };

        fetchMediaData();
    }, [id, mediaType]);

    if (loading) {
        return (
            <div className="text-center p-4 m-4" >
                <RotateSpinner size={50} color="#F9370B" />
            </div>
        );
    }

    const removeFromWatchlist = async (e) => {
        e.stopPropagation();
        try {
            if(onRemove){
                const remove = await onRemove(id, mediaType);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className={className}
            onClick={() => navigate(`/media/${mediaType}/${id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseOut={() => {
                setTimeout(() => {
                    setIsHovered(false);
                }, 2500)
            }}
            ref={ref}
            {...props}
        >
            {loading ? (
                <div className="text-center p-4 m-4">
                    <RotateSpinner size={50} color="#F9370B" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${mediaData.poster_path})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 w-full p-2 bg-black/20 backdrop-blur-md text-white">
                        <h3 className="text-md font-semibold truncate">{mediaData.title || mediaData.name}</h3>
                        <p className="text-sm text-gray-300 truncate">
                            {mediaData.genres.map((genre) => genre.name).join(", ")}
                        </p>
                    </div>
                    {isHovered && (
                        <button
                            onClick={removeFromWatchlist}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full transition duration-200"
                        >
                            <FaTrash size={16} />
                        </button>
                    )}
                </>
            )}
        </div>
    );
});
