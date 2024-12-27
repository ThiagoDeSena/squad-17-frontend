import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthScreen } from "./Screens/AuthScreen";
import { FeedScreen } from "./Screens/FeedScreen";
import { Navigate } from "react-router-dom";
import { NotFoundScreen } from "./Screens/NotFoundScreen"; 
import { UserScreen } from "./Screens/UserScreen";
import { OutherUserScreen } from "./Screens/OtherUsersScreen";

export const RouterApp = () => {
    const userId = localStorage.getItem("userId");
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route
                    path="/"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <Navigate to="/feed"/>
                        : <AuthScreen c={1} />
                    }
                />
                <Route
                    path={`/profile`}
                    element={
                        localStorage.getItem('jwtToken')
                        ? <UserScreen/>
                        : <AuthScreen c={1} />
                    }
                />
                <Route
                    path={`/user/:id`}
                    element={
                        localStorage.getItem('jwtToken')
                        ? <OutherUserScreen/>
                        : <AuthScreen c={1} />
                    }
                />

                <Route
                    path="/register"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <Navigate to="/home" />
                        : <AuthScreen c={2} />
                    }
                />
                <Route
                    path="/feed"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <FeedScreen />
                        : <Navigate to="/" />
                    }
                />
                <Route path="*" element={<NotFoundScreen />} />
            </Routes>
        </BrowserRouter>
    );
};
