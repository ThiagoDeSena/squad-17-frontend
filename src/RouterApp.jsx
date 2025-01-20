import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthScreen } from "./Screens/AuthScreen";
import { FeedScreen } from "./Screens/FeedScreen";
import { Navigate } from "react-router-dom";
import { NotFoundScreen } from "./Screens/NotFoundScreen";
import { UserScreen } from "./Screens/UserScreen";
import { OutherUserScreen } from "./Screens/OtherUsersScreen";
import { MediaScreen } from "./Screens/MediaScreen";
import { SearchScreen } from "./Screens/SearchScreen";
import { useContext } from "react";
import { UserContext } from "./Contexts/UserContext";
import { Loading } from "./components/Utils/Loading";
import { WatchlistScreen } from "./Screens/WatchListScreen";
import { WatchlistCategoryScreen } from "./Screens/WatchListCategoryScreen";
import { CommentPostScreen } from "./Screens/CommentPostScreen";

export const RouterApp = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <Loading />;
    }
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route
                    path="/"
                    element={user ? <FeedScreen /> : <AuthScreen c={1} />}
                />
                <Route path="/register" element={<AuthScreen c={2} />} />
                <Route path="/forgot-password" element={<AuthScreen c={3} />} />
                <Route
                    path="/profile"
                    element={user ? <UserScreen /> : <Navigate to="/" />}
                />
                <Route
                    path="/user/:id"
                    element={user ? <OutherUserScreen /> : <Navigate to="/" />}
                />
                <Route
                    path="/media/:type/:id"
                    element={user ? <MediaScreen /> : <Navigate to="/" />}
                />
                <Route
                    path="/feed"
                    element={user ? <FeedScreen /> : <Navigate to="/" />}
                />

                <Route
                    path="/review/:id"
                    element={user ? <CommentPostScreen/> : <Navigate to="/" />}
                />

                <Route
                    path="/search"
                    element={user ? <SearchScreen /> : <Navigate to="/" />}
                />
                <Route
                    path="/watchlist"
                    element={user ? <WatchlistScreen /> : <Navigate to="/" />}
                />
                <Route
                    path="/watchlist/:category"
                    element={user ? <WatchlistCategoryScreen /> : <Navigate to="/" />}
                />
                <Route path="*" element={<NotFoundScreen />} />
            </Routes>
        </BrowserRouter>
    );
};
