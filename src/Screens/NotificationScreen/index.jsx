import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { deleteNotification, getNotifications, readNotification } from "../../api/notificationApi";
import { getUsersInfo } from "../../api/userAPI";
import { FaTimes } from "react-icons/fa";
import { Loading } from "../../components/Utils/Loading";
import { useNotification } from "../../contexts/NotificationContext";
export const NotificationScreen = () => {
  const [notifications, setNotifications] = useState();
  const { newNotify, setNewNotify } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsResponse = await getNotifications();
        setNotifications(notificationsResponse);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [newNotify]);

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };
  
  const handleNavigate = async (notify) => {
    try {
      await readNotification(notify.id);
      if (notify.type === "like" || notify.type === "comment") {
        navigate(`/review/${notify.reference}`);
      } else {
        navigate(`/user/${notify.reference}`);
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }finally{
      setNewNotify(null);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-neutral90 flex flex-col items-center py-10 px-4 sm:px-10 relative">
      <h1 className="text-white text-2xl font-bold mb-6">📩 Suas Notificações</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-auto md:w-full max-w-2xl rounded-lg  p-4 flex flex-col relative left-9 md:left-0`}
      >
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.li
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={` relative flex items-center justify-between p-4 rounded-lg border-b-2 border-neutral20 last:border-b-0 ${
                    notification.seen ? " bg-neutral80" : "bg-primary90 bg-opacity-60"
                  }`}
                >
                  <div
                    onClick={() => handleNavigate(notification)}
                    className="flex items-center gap-3 cursor-pointer w-full"
                  >
                    <img
                      src={notification.remetenteImage}
                      alt={notification.remetenteName}
                      className="rounded-full h-12 md:h-16 border-2 border-primary80 object-cover"
                    />
                    <div className="flex flex-col flex-1">
                      <p className="text-neutral10 font-semibold font-poppins md:text-lg">{notification.message}</p>
                      <span className="text-neutral20 text-sm">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!notification.seen && (
                    <div className="bg-neutral10 text-neutral90 rounded-lg font-moonjelly text-xs md:text-sm px-2 py-1 absolute bottom-2 right-2">
                      Novo
                    </div>
                  )}

                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-neutral10 hover:text-red-500 absolute top-2 right-2"
                  >
                    <FaTimes size={18} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="text-neutral30 text-center text-lg py-4">Nenhuma notificação no momento.</p>
        )}
      </motion.div>
    </div>
  );
};
