import type { Dispatch, SetStateAction } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import PatientNotificationBell from "./Notification/PatientNotificationBell";
import { Menu } from "lucide-react";

interface PatientHeaderProps {
    setShowSide: Dispatch<SetStateAction<boolean>>;
}

export default function PatientHeader({ 
    setShowSide,
} : PatientHeaderProps) {
    const { user } = useAuthStore();

    return (
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between fixed top-0 left-0 lg:left-72 right-0 z-10">
            {/* Welcome */}
            <div className="flex gap-5 items-center">
                <button 
                    className="cursor-pointer rounded-full hover:bg-gray-100 p-2 lg:hidden"
                    onClick={() => setShowSide(prev => !prev)}
                >
                    <Menu />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-[#1E3D15]">
                        Welcome, {user.firstname}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your healthcare appointments easily
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">

                {/* Notification */}
                <PatientNotificationBell />
            </div>

        </header>
    );
}