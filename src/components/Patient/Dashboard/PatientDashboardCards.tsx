import { CalendarDays } from "lucide-react";
import useGetPatientUpcomingAppointments from "../../../hooks/appointment/use-get-patient-upcoming-appointment.hook"
import DashboardCard from "../../ui/DashboardCard"
import useGetPatientPendingAppointments from "../../../hooks/appointment/use-get-patient-pending-appointment.hook";
import useGetPatientCompletedAppointments from "../../../hooks/appointment/use-get-patient-completed-appointment.hook";
import { useNavigate } from "react-router-dom";

export const PatientUpcomingAppointments = () => {
    const { data } = useGetPatientUpcomingAppointments();
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

    return (
        <DashboardCard 
            title="Upcoming Appointments"
            value={String(data?.upcomingAppointments) || ""}
            icon={<CalendarDays />}
            onClick={() =>
                navigate(`/patient/appointments?sd=${today}&s=Approved`)
            }
        />
    )
}

export const PatientPendingAppointments = () => {
    const { data } = useGetPatientPendingAppointments();
    const navigate = useNavigate();
    
    return (
        <DashboardCard 
            title="Pending Appointments"
            value={String(data?.pendingAppointments) || ""}
            icon={<CalendarDays />}
             onClick={() => navigate(`/patient/appointments?s=Pending`)}
        />
    )
}

export const PatientCompletedAppointments = () => {
    const { data } = useGetPatientCompletedAppointments();
    const navigate = useNavigate();

    return (
        <DashboardCard 
            title="Completed Visits"
            value={String(data?.completedAppointments) || ""}
            icon={<CalendarDays />}
            onClick={() => navigate(`/patient/appointments?s=Completed`)}
        />
    )
}