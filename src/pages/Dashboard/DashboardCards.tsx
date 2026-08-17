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
import DashboardCard from "../../components/ui/DashboardCard";
import useGetTodayAppointments from "../../hooks/appointment/use-get-today-appointments.hook";
import useGetUpcomingAppointments from "../../hooks/appointment/use-get-upcoming-appointments.hook";
import useGetCompletedAppointments from "../../hooks/appointment/use-get-completed-appointments.hook";
import useGetDoctors from "../../hooks/doctor/use-get-doctors.hook";
import useGetTotalPatients from "../../hooks/patient/use-get-total-patients.hook";
import useGetCancelledAppointments from "../../hooks/appointment/use-cancelled-appointments.hook";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/store/authStore";

export const PendingAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetPendingAppointments();

    return (
        <DashboardCard
            title="Pending Appointments"
            value={String(data?.pendingAppointments ?? 0)}
            icon={<Clock3 />}
            onClick={() => navigate(`/${user.role}/appointments?s=Pending`)}
        />
    );
};

export const TodayAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetTodayAppointments();

    return (
        <DashboardCard
            title="Today's Appointments"
            value={String(data?.todayAppointments ?? 0)}
            icon={<CalendarCheck />}
            onClick={() => navigate(`/${user.role}/appointments?sd=${new Date().toISOString().split("T")[0]}&ed=${new Date().toISOString().split("T")[0]}`)}
        />
    );
};

export const UpcomingAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetUpcomingAppointments();

    return (
        <DashboardCard
            title="Upcoming Appointments"
            value={String(data?.upcomingAppointments ?? 0)}
            icon={<CalendarClock />}
            onClick={() =>
                navigate(`/${user.role}/appointments`)
            }
        />
    );
};

export const CompletedAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetCompletedAppointments();

    return (
        <DashboardCard
            title="Completed Appointments"
            value={String(data?.completedAppointments ?? 0)}
            icon={<CircleCheckBig />}
            onClick={() => navigate(`/${user.role}/appointments?s=Completed`)}
        />
    );
};

export const CancelledAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetCancelledAppointments();

    return (
        <DashboardCard
            title="Cancelled Appointments"
            value={String(data?.cancelledAppointments ?? 0)}
            icon={<CalendarX2 />}
            onClick={() => navigate(`/${user.role}/appointments?s=Cancelled`)}
        />
    );
};

export const TotalDoctors = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetDoctors({ });

    return (
        <DashboardCard
            title="Total Doctors"
            value={String(data?.doctors.length ?? 0)}
            icon={<BriefcaseMedical />}
            onClick={() => navigate(`/${user.role}/doctors`)}
        />
    );
};

export const TotalPatients = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data } = useGetTotalPatients()

    return (
        <DashboardCard
            title="Registered Patients"
            value={String(data?.total ?? 0)}
            icon={<Users />}
            onClick={() => navigate(`/${user.role}/patients`)}
        />
    );
};
