import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarPlus,
    History,
    Settings,
    LogOut,
    X,
} from "lucide-react";
import { useAuthStore } from "../../lib/store/authStore";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "../../utils/utils";

const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/patient",
    },
    {
        name: "Book Appointment",
        icon: CalendarPlus,
        path: "/patient/book-appointment",
    },
    {
        name: "Appointment History",
        icon: History,
        path: "/patient/appointments",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/patient/settings",
    },
];

interface PatientSidebarProps {
    setShowSide: Dispatch<SetStateAction<boolean>>;
    showSide: boolean;
}

export default function PatientSidebar({
    setShowSide,
    showSide,
}: PatientSidebarProps) {
    const location = useLocation();
    const { logout } = useAuthStore();

    return (
        <>
            {/* Backdrop */}
            {showSide && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setShowSide(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 w-72 min-h-screen bg-[#1E3D15] text-white flex flex-col overflow-y-auto transition-transform duration-300",
                    showSide ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0 lg:flex"
                )}
            >
                {/* Logo */}
                <div className="px-8 py-8 border-b border-green-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center">
                                <img
                                    src="/bagumbayan-logo.png"
                                    alt="Bagumbayan Logo"
                                />
                            </div>

                            <div>
                                <h2 className="font-bold text-lg">
                                    Bagumbayan HC
                                </h2>

                                <p className="text-sm text-green-200">
                                    Patient Portal
                                </p>
                            </div>
                        </div>

                        {/* Close button (Mobile) */}
                        <button
                            onClick={() => setShowSide(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-green-700"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active =
                                location.pathname === item.path;

                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setShowSide(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                            active
                                                ? "bg-green-800 font-semibold"
                                                : "text-green-100 hover:bg-green-800"
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-green-800">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition"
                        onClick={() => {
                            setShowSide(false);
                            logout();
                        }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}