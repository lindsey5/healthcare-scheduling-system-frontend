import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Appointments from "../components/Appointments/Appointments";
import Services from "../components/Services/Services";
import Doctors from "../components/Doctors/Doctors";
import Dashboard from "../components/Dashboard/Dashboard";
import StaffLayout from "../components/Staff/StaffLayout";
import QrScanner from "../components/QrScanner/QrScanner";

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
            path: 'settings',
            Component: () => <></>
        }
    ],
};