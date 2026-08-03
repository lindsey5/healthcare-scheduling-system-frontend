import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout () {
    return (
        <div className="w-full pl-72">
            <AdminSidebar />
            <Outlet />
        </div>
    )
}