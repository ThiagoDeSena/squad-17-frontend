import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthScreen } from "./Screens/AuthScreen";
export const RouterApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthScreen />} />
            </Routes>
        </BrowserRouter>
    );
};