import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [newNotify, setNewNotify] = useState();

  return (
    <NotificationContext.Provider value={{newNotify, setNewNotify}}>
        {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);