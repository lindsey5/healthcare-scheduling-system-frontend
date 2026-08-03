import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../components/Home/Home";
import UserLogin from "../components/Auth/PatientLogin";
import UserSignUp from "../components/Auth/PatientSignup";
import { PatientRoutes } from "./PatientRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { StaffRoutes } from "./StaffRoutes";

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
    },
    PatientRoutes,
    AdminRoutes,
    StaffRoutes
])

export default function AppRouter () {
    return <RouterProvider router={router}/>
}