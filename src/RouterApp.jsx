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
import { TierRankScreen } from "./Screens/TierRankScreen";

import { Layout } from "./layout";
import { PrivateRoutes } from "./PrivateRoutes";

export const RouterApp = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <Loading />;
    }

    const publicRoutes = [
        { path: "/register", element: <AuthScreen c={2} /> },
        { path: "/forgot-password", element: <AuthScreen c={3} /> },
    ];

    const privateRoutes = [
        { path: "/profile", element: <UserScreen /> },
        { path: "/user/:id", element: <OutherUserScreen /> },
        { path: "/media/:type/:id", element: <MediaScreen /> },
        { path: "/feed", element: <FeedScreen /> },
        { path: "/review/:id", element: <CommentPostScreen /> },
        { path: "/search", element: <SearchScreen /> },
        { path: "/watchlist", element: <WatchlistScreen /> },
        { path: "/watchlist/:category", element: <WatchlistCategoryScreen /> },
        { path: "/tier-rank", element: <TierRankScreen /> },
    ];

    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <Layout>
                                <FeedScreen />
                            </Layout>
                        ) : (
                            <AuthScreen c={1} />
                        )
                    }
                />
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}
                {privateRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <PrivateRoutes>
                                <Layout>{route.element}</Layout>
                            </PrivateRoutes>
                        }
                    />
                ))}
                <Route
                    path="*"
                    element={
                        <Layout>
                            <NotFoundScreen />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};
