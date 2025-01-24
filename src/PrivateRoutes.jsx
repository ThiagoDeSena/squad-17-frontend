import { Navigate } from "react-router-dom";
import { UserContext } from "./Contexts/UserContext";
import { useContext } from "react";

export const PrivateRoutes = ({ children }) => {
    const { user} = useContext(UserContext);
    if(!user){
        return <Navigate to="/" />;
    }
    return children;
}
