import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home/Home";
import UserLogin from "../pages/Auth/PatientLogin";
import UserSignUp from "../pages/Auth/PatientSignup";
import { PatientRoutes } from "./PatientRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { StaffRoutes } from "./StaffRoutes";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

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
    {
        path: 'forgot-password',
        Component: () => <ForgotPassword />
    },
    {
        path: 'reset-password/:token',
        Component: () => <ResetPassword />
    },
    PatientRoutes,
    AdminRoutes,
    StaffRoutes
])

export default function AppRouter () {
    return <RouterProvider router={router}/>
}