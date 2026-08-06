import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import { useState } from "react";

export default function StaffLayout () {
    const [showSide, setShowSide] = useState(false);

    return (
        <div className="w-full lg:pl-72 pt-20">
            <StaffSidebar 
                setShowSide={setShowSide} 
                showSide={showSide}
            />
            <Outlet />
        </div>
    )
}