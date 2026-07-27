import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../components/Home/Home";
import UserLogin from "../components/Auth/UserLogin";
import UserSignUp from "../components/Auth/UserSignup";

const router = createBrowserRouter([
    {
        index: true,
        Component: () => <Home />
    },
    {
        path: 'login',
        Component: () => <UserLogin />
    },
    {
        path: 'signup',
        Component: () => <UserSignUp />
    }
])

export default function AppRouter () {
    return <RouterProvider router={router}/>
}