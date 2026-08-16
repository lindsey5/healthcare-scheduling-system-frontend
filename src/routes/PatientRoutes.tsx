import type { RouteObject } from "react-router-dom";
import AppointmentHistory from "../pages/Patient/AppointmentHistory/AppointmentHistory";
import BookAppointment from "../pages/Patient/BookAppointment/BookAppointment";
import PatientDashboard from "../pages/Patient/Dashboard/PatientDashboard";
import PatientLayout from "../pages/Patient/PatientLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PatientProfile from "../pages/Patient/Profile/PatientProfile";

export const PatientRoutes : RouteObject = {
    path: 'patient',
    Component: () => (
        <ProtectedRoute role="patient">
                <PatientLayout />
        </ProtectedRoute>
    ),
    children: [
        {
            index: true,
            Component: () => <PatientDashboard />
        },
        {
            path: 'book-appointment',
            Component: () => <BookAppointment />
        },
        {
            path: 'appointments',
            Component: () => <AppointmentHistory />
        },
        {
            path: 'profile',
            Component: () => <PatientProfile />
        }
    ]
}