import type { RouteObject } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AdminLogin from "../components/Auth/AdminLogin";

export const AdminRoutes : RouteObject = {
    path: 'admin',
    children: [
        {
            index: true,
            Component: () => (
                <ProtectedRoute role="admin">
                    <AdminLayout />
                </ProtectedRoute>
            )
        },
        {
            path: 'login',
            Component: () => <AdminLogin />
        }
    ]
}