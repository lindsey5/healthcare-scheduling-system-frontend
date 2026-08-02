import {
    Clock3,
    CalendarCheck,
    CalendarClock,
    CircleCheckBig,
    Users,
    BriefcaseMedical,
    CalendarX2,
} from "lucide-react";
import useGetPendingAppointments from "../../hooks/appointment/use-get-pending-appointments.hook";
import DashboardCard from "../ui/DashboardCard";
import useGetTodayAppointments from "../../hooks/appointment/use-get-today-appointments.hook";
import useGetUpcomingAppointments from "../../hooks/appointment/use-get-upcoming-appointments.hook";
import useGetCompletedAppointments from "../../hooks/appointment/use-get-completed-appointments.hook";
import useGetDoctors from "../../hooks/doctor/use-get-doctors.hook";
import useGetTotalPatients from "../../hooks/patient/use-get-total-patients.hook";
import useGetCancelledAppointments from "../../hooks/appointment/use-cancelled-appointments.hook";

export const PendingAppointments = () => {
    const { data } = useGetPendingAppointments();

    return (
        <DashboardCard
            title="Pending Appointments"
            value={String(data?.pendingAppointments ?? 0)}
            icon={<Clock3 />}
        />
    );
};

export const TodayAppointments = () => {
    const { data } = useGetTodayAppointments();

    return (
        <DashboardCard
            title="Today's Appointments"
            value={String(data?.todayAppointments ?? 0)}
            icon={<CalendarCheck />}
        />
    );
};

export const UpcomingAppointments = () => {
    const { data } = useGetUpcomingAppointments();

    return (
        <DashboardCard
            title="Upcoming Appointments"
            value={String(data?.upcomingAppointments ?? 0)}
            icon={<CalendarClock />}
        />
    );
};

export const CompletedAppointments = () => {
    const { data } = useGetCompletedAppointments();

    return (
        <DashboardCard
            title="Completed Appointments"
            value={String(data?.completedAppointments ?? 0)}
            icon={<CircleCheckBig />}
        />
    );
};

export const CancelledAppointments = () => {
    const { data } = useGetCancelledAppointments();

    return (
        <DashboardCard
            title="Cancelled Appointments"
            value={String(data?.cancelledAppointments ?? 0)}
            icon={<CalendarX2 />}
        />
    );
};

export const TotalDoctors = () => {
    const { data } = useGetDoctors({ });

    return (
        <DashboardCard
            title="Total Doctors"
            value={String(data?.doctors.length ?? 0)}
            icon={<BriefcaseMedical />}
        />
    );
};


export const TotalPatients = () => {
    const { data } = useGetTotalPatients()

    return (
        <DashboardCard
            title="Registered Patients"
            value={String(data?.total ?? 0)}
            icon={<Users />}
        />
    );
};
