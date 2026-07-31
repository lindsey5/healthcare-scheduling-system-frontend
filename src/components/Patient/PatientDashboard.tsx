import {
    CalendarDays,
    ClipboardList,
    Stethoscope,
} from "lucide-react";
import DashboardCard from "../ui/DashboardCard";
import Services from "../shared/Services";

export default function PatientDashboard() {
    return (
        <main className="p-6 flex-1 flex flex-col min-h-screen gap-5">

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <DashboardCard
                    title="Upcoming Appointment"
                    value="2"
                    icon={<CalendarDays />}
                />

                <DashboardCard
                    title="Completed Visits"
                    value="8"
                    icon={<ClipboardList />}
                />

                <DashboardCard
                    title="Available Services"
                    value="10"
                    icon={<Stethoscope />}
                />

            </div>

            <Services />

        </main>
    );
}
