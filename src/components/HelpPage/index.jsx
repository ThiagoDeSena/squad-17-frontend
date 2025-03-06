import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { sendEmail } from "../../api/emailService";
import { AlertWindow } from "../Utils/AlertWindow";
import { Loading } from "../Utils/Loading";
import { getUser } from "../../api/userAPI";

// Perguntas e respostas do FAQ
const faqData = [
  {
    question: "O Critix é gratuito?",
    answer:
      "Sim! O Critix é totalmente gratuito para todos os usuários. Você pode avaliar filmes, séries, criar listas personalizadas e interagir com outros cinéfilos sem custo algum.",
  },
  {
    question: "Como funciona a avaliação de filmes e séries?",
    answer:
      "No Critix, você pode dar uma nota de 0 a 5 para qualquer filme ou série, além de escrever uma resenha detalhada com suas opiniões. Também é possível curtir, comentar e compartilhar avaliações de outros usuários.",
  },
  {
    question: "Posso criar listas personalizadas de filmes e séries?",
    answer:
      "Sim! Você pode organizar suas próprias watchlist de filmes e séries, como 'Favoritos', 'Quero assistir', 'Já assistidos' e muito mais. Suas listas podem ser públicas ou privadas, conforme sua preferência.",
  },
  {
    question: "Como seguir outros usuários e visualizar suas avaliações?",
    answer:
      "Você pode seguir outros usuários clicando no perfil deles. Assim, as avaliações e resenhas que eles postarem aparecerão no seu feed de atividades.",
  },
  {
    question: "O Critix recomenda filmes e séries?",
    answer:
      "Sim! Baseado nas suas avaliações e listas, o Critix sugere filmes e séries que podem te interessar. Também há uma seção de 'Tendências', onde você pode ver os conteúdos mais populares no momento.",
  },
  {
    question: "Posso editar ou excluir uma avaliação que já publiquei?",
    answer:
      "Sim! Basta acessar a sua avaliação, clicar nos três pontinhos ao lado dela e selecionar a opção de editar ou excluir.",
  },
  {
    question: "Quais tipos de interações posso ter com outras pessoas na plataforma?",
    answer:
      "No Critix, você pode curtir, comentar e compartilhar resenhas, seguir outros usuários e participar de discussões sobre filmes e séries. Nossa plataforma é um espaço para debates saudáveis e troca de opiniões entre fãs de cinema e TV!",
  },
  {
    question: "Onde posso entrar em contato com a equipe do Critix?",
    answer:
      "Caso tenha alguma dúvida, sugestão ou precise reportar um problema, você pode entrar em contato através do formulário de suporte disponível na página de Ajuda.",
  },
];

export const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setFormData({
          name: response.name,
          email: response.email,
          message: "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sucess = await sendEmail(formData);
      if (sucess) {
        setAlert({
          show: true,
          message: "Email enviado com sucesso!",
          type: "success",
        });
        setFormData({ name: "", email: "", message: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.show) {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  }, [alert.show]);
  return (
    <>
      {alert.show && (
        <AlertWindow type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
      )}
      <div className="min-h-screen bg-neutral90 flex flex-col items-center py-10 px-6">
        <h1 className="text-white text-3xl font-bold font-moonjelly mb-6">❓ Central de Ajuda</h1>

        {/* FAQ */}
        <div className="w-96 md:w-full max-w-fit bg-neutral80 p-6 rounded-lg shadow-lg font-poppins mx-auto relative left-8 md:left-0">
          <h2 className="text-neutral10 text-xl font-semibold mb-4">FAQ's</h2>
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-neutral50">
              <button
                className="flex justify-between items-center w-full text-left py-3 text-primary40 font-medium focus:outline-none md:text-2xl"
                onClick={() => toggleDropdown(index)}
              >
                {item.question}
                <FaChevronDown className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-neutral10 text-md pb-3 max-w-[600px]"
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Botão para abrir o modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 bg-primary80 text-white px-6 py-2 rounded-lg hover:bg-primary60 transition mx-auto relative left-8 md:left-0"
        >
          📩 Entrar em Contato
        </button>

        {/* Modal de Contato */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-neutral90 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-neutral10 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-neutral10 text-2xl font-bold mb-4">📬 Fale Conosco</h2>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Seu Nome"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-neutral80 text-white rounded-md border border-neutral60"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Seu E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-neutral80 text-white rounded-md border border-neutral60"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Escreva sua mensagem..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 h-28 bg-neutral80 text-white rounded-md border border-neutral60 resize-none"
                  required
                />
                <button type="submit" className="bg-primary80 text-white py-2 rounded-md hover:bg-neutral90 transition flex items-center justify-center">
                  {loading ? <Loading size={20} /> : "Enviar Mensagem"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
