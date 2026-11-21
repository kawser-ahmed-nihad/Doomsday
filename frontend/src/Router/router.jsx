import React from "react";
import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import Movies from "../Pages/Home/Movies";
import AddMovieForm from "../Pages/Home/AddMovieForm";
import RewatchPlan from "../Pages/Home/RewatchPlan";
import Booking from "../Pages/Home/Booking";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/movies",
                element: <Movies />
            },
            {
                path: "/rewatch-plan",
                element: <RewatchPlan />
            },
            {
                path: "/booking",
                element: <Booking />
            },

        ]

    },

]);

export default router;