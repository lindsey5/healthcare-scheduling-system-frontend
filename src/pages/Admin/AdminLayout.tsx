import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import AdminHeader from "./AdminHeader";

export default function AdminLayout () {
     const [showSide, setShowSide] = useState(false);

    return (
        <div className="w-full lg:pl-72 pt-20">
            <AdminHeader setShowSide={setShowSide}/>
            <AdminSidebar 
                setShowSide={setShowSide}
                showSide={showSide}
            />
            <Outlet />
        </div>
    )
}