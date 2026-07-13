// src/routes/router.jsx

import { createBrowserRouter } from "react-router";

import App from "../App";
import HomePage from "../pages/HomePage";
import MatchupsPage from "../pages/MatchupsPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "matchups",
        Component: MatchupsPage,
      },
    ],
  },
]);

export default router;