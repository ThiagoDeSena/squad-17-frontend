import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
    },
});

export const getTrendingMovies = async () => {
    try {
        const response = await api.get("/trending/all/day?language=pt-BR");
        return response.data.results;
    } catch (error) {
        console.error(
            `Error ao buscar os dados: ${error.response || error.message}`
        );
        return [];
    }
};

export const getMovieTrailer = async (mediaType, mediaId) => {
    try {
        if (!['movie', 'tv'].includes(mediaType)) {
            throw new Error("Tipo de mídia inválido. Use 'movie' ou 'tv'.");
        }
        const response = await api.get(
            `/${mediaType}/${mediaId}/videos?language=pt-BR`
        );
        const trailer = response.data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) {
            return `https://www.youtube.com/embed/${trailer.key}`;
        }

        return null;
    } catch (error) {
        console.error(
            `Erro ao buscar trailer: ${error.response || error.message}`
        );
        return null;
    }
};

