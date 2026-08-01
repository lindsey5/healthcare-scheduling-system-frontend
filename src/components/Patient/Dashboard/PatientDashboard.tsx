import Services from "../../shared/Services";
import AvailableServicesCard from "../../shared/AvailableServicesCard";
import { PatientCompletedAppointments, PatientPendingAppointments, PatientUpcomingAppointments } from "./PatientDashboardCards";

export default function PatientDashboard() {
    return (
        <main className="p-6 flex-1 flex flex-col min-h-screen gap-5">

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <PatientPendingAppointments />
                <PatientUpcomingAppointments />
                <PatientCompletedAppointments />
                <AvailableServicesCard />
            </div>
            <Services />

        </main>
    );
}
