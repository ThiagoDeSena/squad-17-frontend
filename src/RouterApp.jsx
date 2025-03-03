import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { UserContext } from "./Contexts/UserContext";
import { PrivateRoutes } from "./PrivateRoutes";
import { Layout } from "./layout";
import { Loading } from "./components/Utils/Loading";
import { element } from "prop-types";

const AuthScreen = lazy(() => import("./Screens/AuthScreen").then((module) => ({ default: module.AuthScreen })));

const FeedScreen = lazy(() => import("./Screens/FeedScreen").then((module) => ({ default: module.FeedScreen })));

const NotFoundScreen = lazy(() =>
  import("./Screens/NotFoundScreen").then((module) => ({ default: module.NotFoundScreen }))
);
const UserScreen = lazy(() => import("./Screens/UserScreen").then((module) => ({ default: module.UserScreen })));
const OtherUserScreen = lazy(() =>
  import("./Screens/OtherUsersScreen").then((module) => ({ default: module.OutherUserScreen }))
);
const MediaScreen = lazy(() => import("./Screens/MediaScreen").then((module) => ({ default: module.MediaScreen })));
const SearchScreen = lazy(() => import("./Screens/SearchScreen").then((module) => ({ default: module.SearchScreen })));
const WatchlistScreen = lazy(() =>
  import("./Screens/WatchListScreen").then((module) => ({ default: module.WatchlistScreen }))
);
const WatchlistCategoryScreen = lazy(() =>
  import("./Screens/WatchListCategoryScreen").then((module) => ({ default: module.WatchlistCategoryScreen }))
);
const CommentPostScreen = lazy(() =>
  import("./Screens/CommentPostScreen").then((module) => ({ default: module.CommentPostScreen }))
);
const NotificationScreen = lazy(() =>
  import("./Screens/NotificationScreen").then((module) => ({ default: module.NotificationScreen }))
);
const TierRankScreen = lazy(() =>
  import("./Screens/TierRankScreen").then((module) => ({ default: module.TierRankScreen }))
);
const WelcomeScreen = lazy(() =>
  import("./Screens/WelcomeScreen").then((module) => ({ default: module.WelcomeScreen }))
);

export const RouterApp = () => {
  const { user, loading } = useContext(UserContext);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!user) return;
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcome", "true");
      setTimeout(() => {
        setShowWelcome(false);
      }, 4000);
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const publicRoutes = [
    { path: "/register", element: <AuthScreen c={2} /> },
    { path: "/forgot-password", element: <AuthScreen c={3} /> },
  ];

  const privateRoutes = [
    { path: "/profile", element: <UserScreen /> },
    { path: "/user/:id", element: <OtherUserScreen /> },
    { path: "/media/:type/:id", element: <MediaScreen /> },
    { path: "/feed", element: <FeedScreen /> },
    { path: "/review/:id", element: <CommentPostScreen /> },
    { path: "/search", element: <SearchScreen /> },
    { path: "/watchlist", element: <WatchlistScreen /> },
    { path: "/watchlist/:category", element: <WatchlistCategoryScreen /> },
    { path: "/notifications", element: <NotificationScreen/>},
    { path: "/tier-rank", element: <TierRankScreen /> },
  ];

  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                showWelcome ? (
                  <WelcomeScreen userName={user.name} />
                ) : (
                  <Layout>
                    <FeedScreen />
                  </Layout>
                )
              ) : (
                <AuthScreen c={1} />
              )
            }
          />
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
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
      </Suspense>
    </BrowserRouter>
  );
};
