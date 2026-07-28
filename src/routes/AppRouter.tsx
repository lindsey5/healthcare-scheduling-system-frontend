import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../components/Home/Home";
import UserLogin from "../components/Auth/PatientLogin";
import UserSignUp from "../components/Auth/PatientSignup";
import PatientLayout from "../components/Patient/PatientLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PatientDashboard from "../components/Patient/PatientDashboard";
import BookAppointment from "../components/Patient/BookAppointment/BookAppointment";
import AppointmentHistory from "../components/Patient/AppointmentHistory/AppointmentHistory";

const router = createBrowserRouter([
    {
        index: true,
        Component: () => <Home />
    },
    {
        path: 'login',
        Component: () => <UserLogin />
    },
    {
        path: 'signup',
        Component: () => <UserSignUp />
    },
    {
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
            }
        ]
    }
])

export default function AppRouter () {
    return <RouterProvider router={router}/>
}