import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Appointments from "../pages/Appointments/Appointments";
import Services from "../pages/Services/Services";
import Doctors from "../pages/Doctors/Doctors";
import Dashboard from "../pages/Dashboard/Dashboard";
import StaffLayout from "../pages/Staff/StaffLayout";
import QrScanner from "../pages/QrScanner/QrScanner";
import StaffProfile from "../pages/Staff/Profile/StaffProfile";

export const StaffRoutes: RouteObject = {
    path: "staff",
    Component: () => (
        <ProtectedRoute role="staff">
            <StaffLayout />
        </ProtectedRoute>
    ),
    children: [
        {
            index: true,
            Component: () => <Dashboard />
        },
        {
            path: 'appointments',
            Component: () => <Appointments />
        },
        {
            path: 'services',
            Component: () => <Services />
        },
        {
            path: 'doctors',
            Component: () => <Doctors />
        },
        {
            path: 'scan-qr',
            Component: () => <QrScanner />
        },
        {
            path: 'profile',
            Component: () => <StaffProfile />
        }
    ],
};