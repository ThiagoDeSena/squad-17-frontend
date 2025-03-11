import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { motion, AnimatePresence } from "framer-motion";
import { handleTokenRefresh } from "../../api/handleTokenRefresh";
import { useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { useNotification } from "../../Contexts/NotificationContext";
const Notification = ({ message, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const formattedMessage = message.length > 50 ? `${message.slice(0, 50)}...` : message;
  const handleViewClick = () => {
    navigate(`/notifications`);
    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-5 right-5 bg-neutral90 text-white px-4 py-3 rounded-lg shadow-md border border-primary40 max-w-sm w-full sm:w-96 cursor-pointer"
      onClick={handleViewClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaRegBell size={20} color="#F9370B" />
          <span className="font-poppins font-semibold ">{formattedMessage}</span>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationContainer = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const { newNotify, setNewNotify } = useNotification();
  const [token, setToken] = useState("");
  const NOTIFICATION_LIMIT = 3;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await handleTokenRefresh();
        setToken(response);
      } catch (error) {
        return null;
      }
    };
    fetchToken();
  }, []);

  const socket = new WebSocket("ws://localhost:8081/ws");
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      brokerURL: "ws://localhost:8081/ws",
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: (str) => {
        console.log("STOMP Debug: ", str);
      },
      onConnect: () => {
        console.log("✅ WebSocket Connected!");
        client.subscribe(`/topic/notification/${userId}`, (message) => {
          setNotifications((prev) => [...prev, message.body].slice(-NOTIFICATION_LIMIT));
          setNewNotify(message.body);
        });
      },
      onDisconnect: () => console.log("❌ WebSocket Disconnected!"),
      onStompError: (frame) => {
        console.error("STOMP Error: ", frame.headers["message"]);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      socket.close();
    };
  }, [userId, token]);

  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map((message, index) => (
          <Notification key={index} message={message} onClose={() => removeNotification(index)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
