import Modal from "react-modal";
import { Loading } from "../../Utils/Loading";
import { FaPlus } from "react-icons/fa";

Modal.setAppElement("#root");

export const BannerProfileModal = ({ isSelectBannerOpen, setIsSelectBannerOpen, profileImage, selectedBanner, setSelectedBanner, handleMore, clickMore, loading, handleProfileBanner }) => {
  return (
    <>
      <Modal
        isOpen={isSelectBannerOpen}
        onRequestClose={() => setIsSelectBannerOpen(false)}
        className="bg-neutral80 p-8 rounded-xl h-auto w-[100%] max-w-2xl shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        contentLabel="Select Banner"
        style={{ overlay: { zIndex: 9999 } }}
      >
        <div className="flex flex-col items-center max-h-[80vh] w-[100%] overflow-y-auto font-poppins">
          <h2 className="text-3xl font-bold text-neutral10 font-moonjelly mb-6">Select Banner</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 h-full overflow-auto max-w-full p-2">
            {loading ? (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            ) : profileImage.profileImages && profileImage.profileImages.length > 0 ? (
              profileImage.profileImages.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  className={`w-full h-28 rounded-xl cursor-pointer border-2 transition duration-300 transform hover:scale-105 ${
                    selectedBanner === img.url
                      ? "border-primary40 border-4 scale-105"
                      : "border-neutral30 hover:border-primary20"
                  } shadow-lg hover:shadow-xl`}
                  onClick={() => {
                    if (selectedBanner === img.url) {
                      setSelectedBanner(null);
                    } else {
                      setSelectedBanner(img.url);
                    }
                  }}
                />
              ))
            ) : (
              <p className="text-center text-neutral60">No images available</p>
            )}
            {profileImage.profileImages && profileImage.profileImages.length > 0 && !loading && (
              <div className="flex items-center justify-left">
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
            className="mt-6 px-6 py-2 bg-primary40 text-white rounded-lg hover:bg-primary60 transition duration-300"
            onClick={() => handleProfileBanner(selectedBanner)}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};
