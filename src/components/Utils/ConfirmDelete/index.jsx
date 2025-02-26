import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, text }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-12 md:p-4 left-20 md:left-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-neutral40 p-6 rounded-lg shadow-lg max-w-md w-full text-center font-poppins"
            >
                {/* Ícone de alerta */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-44   text-primary90 rounded-full">
                        <FiAlertCircle size={60} />
                    </div>
                </div>

                {/* Título */}
                <h2 className="text-xl font-semibold text-neutral90">
                    {text}
                </h2>

                {/* Texto de aviso */}
                <p className="text-neutral70 underline text-sm mt-2">
                    Essa ação é irreversível.
                </p>

                {/* Botões de ação */}
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-neutral80 hover:text-neutral10 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                    >
                        Confirmar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmDeleteModal;
