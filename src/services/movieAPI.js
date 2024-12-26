import axios from "axios";

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
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
    const TIMEOUT = 10000; 

    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido")), TIMEOUT)
    );

    try {
        if (!["movie", "tv"].includes(mediaType)) {
            throw new Error("Tipo de mídia inválido. Use 'movie' ou 'tv'.");
        }

        const request = api.get(
            `/${mediaType}/${mediaId}/videos?language=pt-BR`
        );

        const response = await Promise.race([request, timeout]);

        const trailer = response.data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
            return `https://www.youtube.com/embed/${trailer.key}`;
        }

        return "Trailer não encontrado.";
    } catch (error) {
        console.error(
            `Erro ao buscar trailer: ${error.response || error.message}`
        );
        return "Trailer não encontrado.";
    }
};

export const getPopularMovies = async () => {
    try {
        const responseMovie = await api.get("trending/movie/week");
        const responseTv = await api.get("/trending/tv/week");
        return [
            ...responseMovie.data.results.map((movie) => ({
                ...movie,
                mediaType: "movie",
            })),
            ...responseTv.data.results.map((tv) => ({
                ...tv,
                mediaType: "tv",
            })),
        ];
    } catch (error) {
        console.error("Erro ao buscar filmes populares:", error);
        return [];
    }
};

export const getMediaDetails = async (mediaType, mediaId) => {
    try {
        if (!["movie", "tv"].includes(mediaType)) {
            throw new Error("Tipo de mídia inválido. Use 'movie' ou 'tv'.");
        }

        const response = await api.get(
            `/${mediaType}/${mediaId}?language=pt-BR`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Erro ao buscar detalhes da mídia: ${
                error.response || error.message
            }`
        );
        return null;
    }
};
