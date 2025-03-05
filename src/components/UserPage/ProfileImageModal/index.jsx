import { FaPlus } from "react-icons/fa";
import { Loading } from "../../Utils/Loading";
import Modal from "react-modal";

Modal.setAppElement("#root");

export const ProfileImageModal = ({ isSelectImageOpen, setIsSelectImageOpen, profileImage, selectedProfileImage, setSelectedProfileImage, handleMore, clickMore, loading, handleProfileImage }) => {
  return (
    <>
      <Modal
        isOpen={isSelectImageOpen}
        onRequestClose={() => setIsSelectImageOpen(false)}
        className="bg-neutral80 p-4 rounded-xl h-auto w-[95%] max-w-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        contentLabel="Select Profile Image"
        style={{ overlay: { zIndex: 2002 } }}
      >
        <div className="flex flex-col items-center max-h-[80vh] overflow-y-auto font-poppins">
          <h2 className="text-3xl font-bold text-neutral10 mb-6 text-center font-moonjelly">Select Profile Image</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-3 h-full overflow-auto max-w-full p-2">
            {loading ? (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            ) : profileImage.profileImages && profileImage.profileImages.length > 0 ? (
              profileImage.profileImages.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  loading="lazy"
                  className={`w-20 h-20 rounded-full cursor-pointer border-2 transition duration-300 ${
                    selectedProfileImage === img.url
                      ? "border-primary40 border-4 scale-105"
                      : "border-neutral30 hover:border-primary20"
                  }`}
                  onClick={() => {
                    if (selectedProfileImage === img.url) {
                      setSelectedProfileImage(null);
                    } else {
                      setSelectedProfileImage(img.url);
                    }
                  }}
                />
              ))
            ) : (
              <p className="text-center text-neutral60">No images available</p>
            )}
            {profileImage.profileImages && profileImage.profileImages.length > 0 && !loading && (
              <div className="flex items-center justify-center">
                <button
                  className="mt-6 px-6 py-2 bg-primary30 text-white rounded-lg hover:bg-primary20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleMore(selectedProfileImage)}
                  disabled={clickMore}
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </div>
          <button
            className="mt-6 w-full px-6 py-2 bg-primary40 text-white rounded-lg hover:bg-primary60 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleProfileImage(selectedProfileImage)}
            disabled={clickMore}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};
