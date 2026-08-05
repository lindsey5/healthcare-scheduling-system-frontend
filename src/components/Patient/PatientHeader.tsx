import { useAuthStore } from "../../lib/store/authStore";
import PatientNotificationBell from "./Notification/PatientNotificationBell";

export default function PatientHeader() {
    const { user } = useAuthStore();

    return (
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between fixed top-0 left-72 right-0 z-10">

            {/* Welcome */}
            <div>
                <h1 className="
                    text-xl
                    font-bold
                    text-[#1E3D15]
                ">
                    Welcome, {user.firstname}
                </h1>

                <p className="
                    text-sm
                    text-gray-500
                    mt-1
                ">
                    Manage your healthcare appointments easily
                </p>
            </div>


            {/* Actions */}
            <div className="
                flex
                items-center
                gap-5
            ">

                {/* Notification */}
                <PatientNotificationBell />
            </div>

        </header>
    );
}