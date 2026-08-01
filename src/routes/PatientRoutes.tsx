import type { RouteObject } from "react-router-dom";
import AppointmentHistory from "../components/Patient/AppointmentHistory/AppointmentHistory";
import BookAppointment from "../components/Patient/BookAppointment/BookAppointment";
import PatientDashboard from "../components/Patient/Dashboard/PatientDashboard";
import PatientLayout from "../components/Patient/PatientLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

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
    ]
}