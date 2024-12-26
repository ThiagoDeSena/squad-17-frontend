import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { getMediaDetails } from "../../../../services/movieAPI";
import { RecomendedCard } from "../../Recomended/RecomendedCard";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { PiChatCircleTextFill } from "react-icons/pi";

export const ReviewContainer = ({ movieId, plataform }) => {
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [mediaData, setMediaData] = useState([]);

    useEffect(() => {
        try {
            const fetchMediaDetails = async () => {
                const data = await getMediaDetails(plataform, movieId);
                setMediaData(data);
            };
            fetchMediaDetails();
        } catch (error) {
            console.error("Erro ao buscar detalhes do filme:", error);
        }
    }, []);

    return (
        <div className="bg-transparent border-2 border-neutral60 p-4 rounded-lg mb-[10%] flex flex-col-reverse md:flex-row-reverse gap-6 w-[80%] lg:w-full m-auto">
            {/* Imagem da Avaliação */}
            <div className="w-full md:w-1/3 flex-shrink-0">
                <RecomendedCard
                    image={`https://image.tmdb.org/t/p/w1280/${mediaData.backdrop_path}`}
                    title={
                        mediaData.title ||
                        mediaData.name ||
                        "Título não disponível"
                    }
                    genre={mediaData.genres
                        ?.map((genre) => genre.name)
                        .join(", ")}
                    onAddToWatchlist={() =>
                        console.log(
                            `Adicionado à Watchlist: ${
                                mediaData.title || mediaData.name
                            }`
                        )
                    }
                    className="relative w-full h-56 md:h-96 rounded-lg overflow-hidden shadow-sm shadow-neutral60 cursor-pointer transform ease-in-out hover:scale-105 font-poppins text-center border-2 border-neutral80"
                />
            </div>
    
            {/* Conteúdo */}
            <div className="w-full md:w-2/3 flex flex-col justify-between font-poppins">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src="/images/user-img2.png"
                            alt="Profile"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary20 hover:scale-125 transition duration-300 hover:cursor-pointer"
                        />
                        <div>
                            <p className="text-xs md:text-sm text-gray-400">
                                2 horas atrás
                            </p>
                            <p className="font-semibold text-sm md:text-base hover:underline hover:cursor-pointer">
                                Ava Anderson
                            </p>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`cursor-pointer ${
                                            i < 5
                                                ? "text-yellow-500"
                                                : "text-gray-500"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Conteúdo da Resenha */}
                    {containsSpoilers ? (
                        <div className="bg-semanticWarning opacity-80 text-white p-2 mb-4 rounded">
                            <p className="text-sm">
                                <strong>Aviso de Spoiler:</strong> Esta resenha
                                contém spoilers. Você tem certeza que deseja
                                continuar?
                            </p>
                            <button
                                onClick={() => setContainsSpoilers(false)}
                                className="underline text-blue-300 text-sm"
                            >
                                Mostrar Resenha
                            </button>
                        </div>
                    ) : (
                        // Resenha do usuário
                        <p className="text-neutral20 max-h-48 md:max-h-64 leading-relaxed tracking-wide text-justify indent-6 text-xs md:text-sm overflow-auto p-2">
                             A Esse é um filme de aventura e
                            fantasia que se destaca por sua trama envolvente e
                            personagens cativantes. Dirigido por um cineasta
                            renomado, o longa apresenta uma história clássica de
                            superação e crescimento pessoal, com uma narrativa
                            que segue os arquétipos conhecidos do gênero, mas
                            com uma abordagem única e sensível. O enredo gira em
                            torno de Lucas, um jovem comum que se vê
                            inesperadamente em uma missão épica para salvar seu
                            mundo de uma ameaça iminente. Ao longo da jornada,
                            ele é acompanhado por uma equipe de aliados, cada um
                            com suas habilidades e passados distintos, mas
                            unidos por um objetivo maior. O filme mergulha nas
                            dinâmicas de amizade, lealdade e coragem, oferecendo
                            ao público uma reflexão sobre o poder da união
                            diante das adversidades. A cinematografia é de tirar
                            o fôlego, com cenas de ação que combinam efeitos
                            visuais impressionantes e coreografias bem
                            executadas. A fotografia, por sua vez, destaca as
                            paisagens deslumbrantes, criando um contraste entre
                            a beleza natural e o perigo iminente. A direção de
                            arte e os efeitos especiais são usados de forma
                            inteligente, criando um universo visualmente rico,
                            mas sem sobrecarregar a trama. O elenco é igualmente
                            sólido, com atuações memoráveis, especialmente do
                            protagonista, que consegue equilibrar a
                            vulnerabilidade e a determinação de seu personagem.
                            Embora alguns clichês possam ser identificados, a
                            performance genuína dos atores ajuda a dar
                            profundidade aos personagens, tornando-os mais
                            humanos e relacionáveis. A trilha sonora, composta
                            por uma mistura de músicas épicas e momentos mais
                            introspectivos, complementa perfeitamente as emoções
                            de cada cena, ampliando a conexão emocional do
                            público com os acontecimentos. A edição do filme
                            mantém o ritmo de forma eficiente, alternando
                            momentos de tensão e alívio com naturalidade. Embora
                            não traga nenhuma inovação radical ao gênero, “A
                            Jornada do Herói” é uma obra competente que oferece
                            entretenimento de qualidade. A mensagem de
                            autodescoberta e coragem ressoa de maneira
                            universal, fazendo do filme uma experiência
                            agradável para qualquer amante de histórias de
                            aventura.
                        </p>
                    )}
                </div>
    
                {/* Interações */}
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => setLiked(!liked)}
                        className="flex items-center gap-1"
                    >
                        <BiSolidLike
                            className={`text-lg md:text-xl ${
                                liked ? "text-semanticInfo" : "text-neutral50"
                            }`}
                        />
                        10K
                    </button>
                    <button
                        onClick={() => setDisliked(!disliked)}
                        className="flex items-center gap-1"
                    >
                        <BiSolidDislike
                            className={`text-lg md:text-xl ${
                                disliked
                                    ? "text-semanticError"
                                    : "text-neutral50"
                            }`}
                        />
                        2K
                    </button>
                    <button className="flex items-center gap-1">
                        <PiChatCircleTextFill className="text-lg md:text-xl text-neutral50" />
                        300
                    </button>
                </div>
            </div>
        </div>
    );
    
};
