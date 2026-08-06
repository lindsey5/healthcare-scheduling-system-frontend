import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import PatientHeader from "./PatientHeader";
import { useState } from "react";

export default function PatientLayout () {
    const [showSide, setShowSide] = useState(false);

    return (
        <div className="w-full lg:pl-72 pt-20">
            <PatientSidebar 
                setShowSide={setShowSide}
                showSide={showSide}
            />
            <PatientHeader 
                setShowSide={setShowSide}
            />
            <Outlet />
        </div>
    )
}