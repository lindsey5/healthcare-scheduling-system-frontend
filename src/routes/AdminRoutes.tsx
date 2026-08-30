import type { RouteObject } from "react-router-dom";
import AdminLayout from "../pages/Admin/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AdminLogin from "../pages/Auth/AdminLogin";
import Appointments from "../pages/Appointments/Appointments";
import Services from "../pages/Services/Services";
import Doctors from "../pages/Doctors/Doctors";
import Patients from "../pages/Patients/Patients";
import Dashboard from "../pages/Dashboard/Dashboard";
import Admins from "../pages/Admin/Admins/Admins";
import Staffs from "../pages/Admin/Staffs/Staffs";
import QrScanner from "../pages/QrScanner/QrScanner";
import AdminProfile from "../pages/Admin/Profile/AdminProfile";
import Messages from "../pages/Admin/Messages/Messages";
import Audits from "../pages/Admin/Audits/Audits";

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
                    element: <QrScanner />
                },
                {
                    path: 'messages',
                    element: <Messages />
                },
                {
                    path: 'audit-logs',
                    element: <Audits />
                },
                {
                    path: 'profile',
                    element: <AdminProfile />
                }
            ],
        },
    ],
};