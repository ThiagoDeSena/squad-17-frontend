import { IoCloseSharp } from "react-icons/io5";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

export const FollowList = ({ showFollow, setShowFollow, followers, isType }) => {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        isOpen={showFollow}
        onRequestClose={() => setShowFollow(false)}
        className="bg-white font-poppins rounded-3xl h-auto w-[90%] max-w-lg shadow-xl transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 max-h-screen overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        style={{ overlay: { zIndex: 9999 }, content: { borderRadius: "1.5rem" } }}
        contentLabel={`${isType === "followers" ? "Seguidores" : "Seguindo"}`}
      >
        <div
          className={`relative p-6 bg-gradient-to-tl from-indigo-600 to-${
            isType === "followers" ? "indigo-500" : "primary90"
          } rounded-xl shadow-lg`}
        >
          <h2 className="text-3xl font-bold text-neutral90 font-moonjelly mb-6 text-center">{`${
            isType === "followers" ? "Seguidores" : "Seguindo"
          }`}</h2>
          {followers.length === 0 ? (
            <p className="text-center text-lg text-gray-300">Nenhum seguidor encontrado.</p>
          ) : (
            <ul className="space-y-5">
              {followers.map((follower) => (
                <li
                  key={follower.userId}
                  className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-md hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                >
                  <img
                    src={follower.image}
                    alt={follower.name}
                    className="w-14 h-14 rounded-full border-2 border-primary60 shadow-lg"
                  />
                  <div>
                    <p
                      className="font-moonjelly text-2xl text-indigo-700 hover:underline"
                      onClick={() => {
                        setShowFollow(false);
                        navigate(`/user/${follower.username}`);
                      }}
                    >
                      {follower.user ? "Você" : follower.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="absolute top-4 right-4 text-gray-200 hover:text-gray-400 transition duration-300"
            onClick={() => setShowFollow(false)}
          >
            <IoCloseSharp size={30} />
          </button>
        </div>
      </Modal>
    </>
  );
};
