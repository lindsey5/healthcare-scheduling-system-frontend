import type { RouteObject } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AdminLogin from "../components/Auth/AdminLogin";
import Appointments from "../components/Appointments/Appointments";
import Services from "../components/Services/Services";

export const AdminRoutes: RouteObject = {
    path: "admin",
    children: [
        {
            path: "login",
            element: <AdminLogin />,
        },
        {
            element: (
                <ProtectedRoute role="admin">
                <   AdminLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Appointments />,
                },
                {
                    path: "appointments",
                    element: <Appointments />,
                },
                {
                    path: "services",
                    element: <Services />
                }
            ],
        },
    ],
};