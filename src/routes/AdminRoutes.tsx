import type { RouteObject } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";

export const AdminRoutes : RouteObject = {
    path: 'admin',
    Component: () => (
        <AdminLayout />
    ),
    children: [
        
    ]
}