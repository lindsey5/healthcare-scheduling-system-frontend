import type { RouteObject } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AdminLogin from "../components/Auth/AdminLogin";
import Appointments from "../components/Appointments/Appointments";
import Services from "../components/Services/Services";
import Doctors from "../components/Doctors/Doctors";
import Patients from "../components/Patients/Patients";
import Dashboard from "../components/Dashboard/Dashboard";
import Admins from "../components/Admins/Admins";
import Staffs from "../components/Staffs/Staffs";
import ScanQr from "../components/ScanQr/ScanQr";

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
                    <AdminLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Dashboard />,
                },
                {
                    path: "appointments",
                    element: <Appointments />,
                },
                {
                    path: "services",
                    element: <Services />
                },
                {
                    path: 'doctors',
                    element: <Doctors />
                },
                {
                    path: 'admins',
                    element: <Admins />
                },
                {
                    path: 'staffs',
                    element: <Staffs />
                },
                {
                    path: 'patients',
                    element: <Patients />
                },
                {
                    path: 'scan-qr',
                    element: <ScanQr />
                }
            ],
        },
    ],
};