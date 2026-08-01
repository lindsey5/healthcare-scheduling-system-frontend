import { CalendarDays } from "lucide-react";
import useGetPatientUpcomingAppointments from "../../../hooks/appointment/use-get-patient-upcoming-appointment.hook"
import DashboardCard from "../../ui/DashboardCard"
import useGetPatientPendingAppointments from "../../../hooks/appointment/use-get-patient-pending-appointment.hook";
import useGetPatientCompletedAppointments from "../../../hooks/appointment/use-get-patient-completed-appointment.hook";

export const PatientUpcomingAppointments = () => {
    const { data } = useGetPatientUpcomingAppointments();
    
    return (
        <DashboardCard 
            title="Upcoming Appointments"
            value={String(data?.upcomingAppointments) || ""}
            icon={<CalendarDays />}
        />
    )
}

export const PatientPendingAppointments = () => {
    const { data } = useGetPatientPendingAppointments();
    
    return (
        <DashboardCard 
            title="Pending Appointments"
            value={String(data?.pendingAppointments) || ""}
            icon={<CalendarDays />}
        />
    )
}

export const PatientCompletedAppointments = () => {
    const { data } = useGetPatientCompletedAppointments();

    return (
        <DashboardCard 
            title="Completed Visits"
            value={String(data?.completedAppointments) || ""}
            icon={<CalendarDays />}
        />
    )
}