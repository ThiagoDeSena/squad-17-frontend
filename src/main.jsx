import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterApp } from "./RouterApp";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "./Contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./contexts/NotificationContext";

createRoot(document.getElementById("root")).render(
  <>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
      <UserProvider>
        <NotificationProvider>
          <RouterApp />
        </NotificationProvider>
      </UserProvider>
    </GoogleOAuthProvider>
    <Analytics />
  </>
);
