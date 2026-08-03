import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";

export default function StaffLayout () {
    return (
        <div className="w-full pl-72">
            <StaffSidebar />
            <Outlet />
        </div>
    )
}