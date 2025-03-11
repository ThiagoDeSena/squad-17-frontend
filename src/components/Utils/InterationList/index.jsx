import { IoCloseSharp } from "react-icons/io5";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

export const InterationList = ({showInteration, setShowInteration, interation, isType}) => {
    const navigate = useNavigate();
    return (
        <>
          <Modal
            isOpen={showInteration}
            onRequestClose={() => setShowInteration(false)}
            className="bg-transparent font-poppins rounded-3xl h-auto max-h-[60vh]  w-[90%] max-w-lg shadow-xl transition-all duration-300 ease-in-out transform scale-100 hover:scale-105  overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            style={{ overlay: { zIndex: 9999 }, content: { borderRadius: "1.5rem" } }}
            contentLabel={`${isType === "like" ? "Likes" : "Dislikes"}`}
          >
            <div
              className={`relative p-6 bg-gradient-to-tl from-indigo-900 to-${
                isType === "like" ? "orange-700" : "yellow-600"
              } rounded-xl shadow-lg`}
            >
              <h2 className="text-3xl font-bold text-neutral10 font-moonjelly mb-6 text-center">{`${
                isType === "like" ? "Likes" : "Dislikes"
              }`}</h2>
              {interation.length === 0 ? (
                <p className="text-center text-lg text-gray-300">Nenhuma interação encontrada</p>
              ) : (
                <ul className="space-y-5">
                  {interation.map((interation) => (
                    <li
                      key={interation.userId}
                      className="flex items-center gap-4 p-3 bg-neutral30 rounded-lg shadow-md hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                    >
                      <img
                        src={interation.image}
                        alt={interation.nome}
                        className="w-14 h-14 rounded-full border-2 border-primary60 shadow-lg"
                      />
                      <div>
                        <p
                          className="font-moonjelly text-2xl text-indigo-700 hover:underline"
                          onClick={() => {
                            setShowInteration(false);
                            navigate(`/user/${interation.username}`);
                          }}
                        >
                          {interation.user ? "Você" : interation.nome}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="absolute top-4 right-4 text-gray-200 hover:text-gray-400 transition duration-300"
                onClick={() => setShowInteration(false)}
              >
                <IoCloseSharp size={30} />
              </button>
            </div>
          </Modal>
        </>
      );
};