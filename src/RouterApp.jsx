import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthScreen } from "./Screens/AuthScreen";
import { FeedScreen } from "./Screens/FeedScreen";
import { Navigate } from "react-router-dom";
import { NotFoundScreen } from "./Screens/NotFoundScreen"; 
import { UserScreen } from "./Screens/UserScreen";
import { OutherUserScreen } from "./Screens/OtherUsersScreen";
import { MediaScreen } from "./Screens/MediaScreen";
import { SearchScreen } from "./Screens/SearchScreen";

export const RouterApp = () => {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={
                        localStorage.getItem('jwtToken')
                        ? <FeedScreen />
                        : <AuthScreen c={1} />
                    } />
                <Route path="/register" element={<AuthScreen c={2} />} />
                <Route path="/forgot-password" element={<AuthScreen c={3} />} />
                <Route
                    path="/profile"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <UserScreen/>
                        : <Navigate to="/" />
                    }
                />
                <Route
                    path="/user/:id"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <OutherUserScreen/>
                        : <Navigate to="/" />
                    }
                />

                <Route
                    path="/media/:type/:id"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <MediaScreen/>
                        : <Navigate to="/" />
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
                <Route
                    path="/search"
                    element={
                        localStorage.getItem('jwtToken')
                        ? <SearchScreen />
                        : <Navigate to="/" />
                    }
                />

                <Route path="*" element={<NotFoundScreen />} />
            </Routes>
        </BrowserRouter>
    );
};

