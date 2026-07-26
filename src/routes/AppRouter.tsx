import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../components/Home/Home";

const router = createBrowserRouter([
    {
        index: true,
        Component: () => <Home />
    }
])

export default function AppRouter () {
    return <RouterProvider router={router}/>
}