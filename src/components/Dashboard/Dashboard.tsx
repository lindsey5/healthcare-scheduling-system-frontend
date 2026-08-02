import AvailableServicesCard from "../shared/AvailableServicesCard";
import { CancelledAppointments, CompletedAppointments, PendingAppointments, TodayAppointments, TotalDoctors, TotalPatients, UpcomingAppointments } from "./DashboardCards";

export default function Dashboard () {
    return (
        <main className="p-6 flex-1 flex flex-col min-h-screen gap-5">
            <h1 className="text-3xl font-bold text-[#1E3D15]">
                Dashboard
            </h1>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <TodayAppointments />
                <AvailableServicesCard />
                <TotalDoctors />
                <TotalPatients />
                <PendingAppointments />
                <UpcomingAppointments />
                <CompletedAppointments />
                <CancelledAppointments />
            </div>
        </main>
    )
}