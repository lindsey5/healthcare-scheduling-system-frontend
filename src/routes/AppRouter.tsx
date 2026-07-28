import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../components/Home/Home";
import UserLogin from "../components/Auth/PatientLogin";
import UserSignUp from "../components/Auth/PatientSignup";
import PatientLayout from "../components/Patient/PatientLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PatientDashboard from "../components/Patient/PatientDashboard";
import BookAppointment from "../components/Patient/BookAppointment/BookAppointment";

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
            }
        ]
    }
])

export default function AppRouter () {
    return <RouterProvider router={router}/>
}