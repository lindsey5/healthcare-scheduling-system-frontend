import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import { useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffChat from "../../components/StaffChat/StaffChat";

export default function StaffLayout () {
    const [showSide, setShowSide] = useState(false);

    return (
        <div className="w-full lg:pl-72 pt-20">
            <StaffHeader 
                setShowSide={setShowSide}
            />
            <StaffSidebar 
                setShowSide={setShowSide} 
                showSide={showSide}
            />
            <Outlet />
            <StaffChat />
        </div>
    )
}