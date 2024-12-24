import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthScreen } from "./Screens/AuthScreen";
import {FeedScreen} from "./Screens/FeedScreen"
import { Navigate } from "react-router-dom";

export const RouterApp = () => {
    return (
            <BrowserRouter basename="/">
                <Routes>
                    <Route
                    path="/"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <Navigate to="/feed"/>
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
                    path='/feed'
                    element={
                        localStorage.getItem('jwtToken')
                        ? <FeedScreen />
                        : <Navigate to="/" />
                    }/>
                </Routes>
            </BrowserRouter>
    );
};