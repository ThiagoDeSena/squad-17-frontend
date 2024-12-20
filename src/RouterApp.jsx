import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthScreen } from "./Screens/AuthScreen";
import {HomeScreen} from "./Screens/HomeScreen"
import { Navigate } from "react-router-dom";

export const RouterApp = () => {
    return (
            <BrowserRouter basename="/">
                <Routes>
                    <Route
                    path="/"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <Navigate to="/home" />
                        : <AuthScreen c={1} />
                    }/>
                    <Route
                    path="/register"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <Navigate to="/home" />
                        : <AuthScreen c={2} />
                    }/>
                    <Route
                    path='/home'
                    element={
                        localStorage.getItem('jwtToken')
                        ? <HomeScreen />
                        : <Navigate to="/" />
                    }/>
                </Routes>
            </BrowserRouter>
    );
};