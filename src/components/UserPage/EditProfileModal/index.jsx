import { useContext, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Modal from "react-modal";
import { deleteUser, updateUser } from "../../../api/userAPI";
import { UserContext } from "../../../contexts/UserContext";
import { DeleteProfileModal } from "../DeleteProfileModal";

Modal.setAppElement("#root");

const validateFormData = (formData, userInfo) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "O nome é obrigatório.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "O email é obrigatório.";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Email inválido.";
  }

  if (formData.password) {
    if (formData.password.length < 8) {
      errors.password = "A senha deve ter pelo menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.password = "A senha deve conter pelo menos uma letra maiúscula.";
    }
    if (!/[a-z]/.test(formData.password)) {
      errors.password = "A senha deve conter pelo menos uma letra minúscula.";
    }
    if (!/\d/.test(formData.password)) {
      errors.password = "A senha deve conter pelo menos um número.";
    }
    if (!/[!@#$%^&*]/.test(formData.password)) {
      errors.password = "A senha deve conter pelo menos um caractere especial.";
    }
  }

  if (formData.password && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem.";
  }

  return errors;
};

export const EditProfileModal = ({
  isEditProfileOpen,
  setIsEditProfileOpen,
  userInfo,
  setOnUpdate,
  setAlertWindow,
}) => {
  const { login, logout } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: userInfo.name || "",
    email: userInfo.email || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setErrors({ deletePassword: "Digite sua senha para confirmar." });
      return;
    }
    try {
      setLoading(true);
      await deleteUser(deletePassword);
      setAlertWindow({ message: "Conta excluída! Até a próxima!", type: "success" });
      setIsEditProfileOpen(false);
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        logout();
      }, 2500)
    } catch (error) {
      console.log(error)
      setErrors({ deletePassword: error.response.data || "Erro ao excluir conta" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Valida em tempo real apenas o campo alterado
    const fieldErrors = validateFormData({ ...formData, [e.target.name]: e.target.value }, userInfo);
    setErrors({ ...errors, [e.target.name]: fieldErrors[e.target.name] || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateFormData(formData, userInfo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updates = {};
    if (formData.name !== userInfo.name) updates.name = formData.name;
    if (formData.email !== userInfo.email) updates.email = formData.email;
    if (formData.password) {
      updates.senha = {
        senha: formData.password,
        confirmacaoSenha: formData.confirmPassword,
      };
    }

    if (Object.keys(updates).length === 0) {
      setIsEditProfileOpen(false);
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateUser(updates);
      login(updatedUser.token, updatedUser.refreshToken);
      setOnUpdate(updatedUser);
      setAlertWindow({
        message: "Perfil atualizado com sucesso!",
        type: "success",
      });
      setIsEditProfileOpen(false);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Erro ao atualizar perfil" });
      setAlertWindow({
        message: "Erro ao atualizar perfil",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isEditProfileOpen}
        onRequestClose={() => setIsEditProfileOpen(false)}
        className="bg-neutral80 p-8 rounded-xl h-auto w-[90%] max-w-lg shadow-xl font-poppins"
        overlayClassName={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
          isDeleteModalOpen && "hidden"
        }`}
        contentLabel="Edit Profile"
        style={{ overlay: { zIndex: 9999 } }}
      >
        <div className="flex flex-col items-center relative">
          <h2 className="text-3xl font-bold text-neutral10 mb-6">Edit Profile</h2>
          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral10 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:ring-2 focus:ring-primary50"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral10 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:ring-2 focus:ring-primary50"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Password Fields */}
            <div className="relative">
              <label className="block text-sm font-semibold text-neutral10 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a new password"
                className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:ring-2 focus:ring-primary50"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-neutral10 mb-1">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 border border-neutral30 rounded-lg focus:ring-2 focus:ring-primary50"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-evenly gap-4 text-sm md:text-base">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </button>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white rounded-lg transition bg-primary40 hover:bg-primary60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-neutral10 rounded-lg hover:bg-red-800 transition"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Excluir Conta
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
      {isDeleteModalOpen && (
        <DeleteProfileModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          deletePassword={deletePassword}
          setDeletePassword={setDeletePassword}
          showDeletePassword={showDeletePassword}
          setShowDeletePassword={setShowDeletePassword}
          errors={errors}
          handleDeleteAccount={handleDeleteAccount}
          loading={loading}
        />
      )}
    </>
  );
};
