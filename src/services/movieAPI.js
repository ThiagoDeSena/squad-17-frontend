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
            (video) =>
                video.type === "Trailer" ||
                (video.type === "Teaser" && video.site === "YouTube")
        );

        if (trailer) {
            return `https://www.youtube.com/embed/${trailer.key}`;
        }

        return null;
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

export const getMediaMoreDetails = async (mediaType, mediaId) => {
    try {
        const detailsEndpoint = `/${mediaType}/${mediaId}?language=pt-BR`;
        const creditsEndpoint = `/${mediaType}/${mediaId}/credits?language=en-US`;
        

        // Fazer as requisições simultaneamente
        const [details, credits] = await Promise.all([
            api.get(detailsEndpoint) || null,
            api.get(creditsEndpoint) || null,
        ]);
        
        // Retornar os dados combinados
        return {
            details: details.data,
            credits: credits.data,
        };
    } catch (error) {
        console.error("Error fetching series details:", error);
        throw new Error("Unable to fetch series details.");
    }
};

export const getSimilarMedia = async (mediaType, mediaId) => {
    const defaultMedia = { type: 'tv', id: 63174 };

    try {
        const response = await api.get(
            `/${mediaType}/${mediaId}/recommendations?language=pt-BR`
        );

        if (!response.data.results || response.data.results.length === 0) {
            return await getSimilarMedia(defaultMedia.type, defaultMedia.id);
        }

        return response.data.results;
    } catch (error) {
        console.error(
            `Erro ao buscar filmes similares: ${error.response || error.message}`
        );
        return [];
    }
};


export const searchResults = async (query, options = {}) => {
    if (!query || query.trim().length < 2) {
        return {
            success: false,
            message: "O termo de busca deve ter pelo menos 2 caracteres.",
            data: [],
        };
    }

    const { language = "pt-BR", timeout = 5000, page, ...extraParams } = options;

    try {
        const response = await api.get("/search/multi", {
            params: {
                query,
                include_adult: false,
                language,
                page,
                ...extraParams,
            },
            timeout,
        });

        return {
            success: true,
            data: response.data.results,
        };
    } catch (error) {
        console.error(
            `Erro ao buscar resultados: ${
                error.response?.data?.status_message || error.message
            }`
        );

        return {
            success: false,
            message:
                error.response?.data?.status_message ||
                "Erro ao buscar os resultados. Tente novamente mais tarde.",
            data: [],
        };
    }
};
