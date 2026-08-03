import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import PatientHeader from "./PatientHeader";

export default function PatientLayout () {
    return (
        <div className="w-full pl-72 pt-20">
            <PatientSidebar />
            <PatientHeader />
            <Outlet />
        </div>
    )
}