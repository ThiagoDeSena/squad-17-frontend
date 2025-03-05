import { IoEye, IoEyeOff } from "react-icons/io5";

import Modal from "react-modal";
Modal.setAppElement("#root");
export const DeleteProfileModal = ({
  isDeleteModalOpen,
  setDeletePassword,
  deletePassword,
  showDeletePassword,
  setShowDeletePassword,
  errors,
  handleDeleteAccount,
  loading,
  setIsDeleteModalOpen,
}) => {
  return (
    <>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-neutral90 p-8 rounded-xl h-auto w-[90%] max-w-md shadow-xl font-poppins"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        style={{overlay: {zIndex: 9999}}}
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">Confirmar Exclusão</h2>
        <p className="text-neutral10 mb-4">
          Tem certeza de que deseja excluir sua conta? Essa ação é irreversível e todos os seus dados serão apagados.
        </p>

        <div className="relative">
          <label className="block text-sm font-semibold text-neutral10 mb-1">Digite sua senha</label>
          <input
            type={showDeletePassword ? "text" : "password"}
            name="deletePassword"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:ring-2 focus:ring-primary50"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-600"
            onClick={() => setShowDeletePassword(!showDeletePassword)}
          >
            {showDeletePassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
          </button>
          {errors.deletePassword && <p className="text-red-500 text-base p-2">{errors.deletePassword}</p>}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Confirmar"}
          </button>
        </div>
      </Modal>
    </>
  );
};
