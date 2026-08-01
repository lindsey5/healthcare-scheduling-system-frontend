import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    Users,
    UserCog,
    UserRound,
    BriefcaseMedical,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuthStore } from "../../lib/store/authStore";

const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
    },
    {
        name: "Appointments",
        icon: CalendarDays,
        path: "/admin/appointments",
    },
    {
        name: "Healthcare Services",
        icon: Stethoscope,
        path: "/admin/services",
    },
    {
        name: "Doctors",
        icon: BriefcaseMedical,
        path: "/admin/doctors",
    },
    {
        name: "Staffs",
        icon: Users,
        path: "/admin/staffs",
    },
    {
        name: "Admins",
        icon: UserCog,
        path: "/admin/admins",
    },
    {
        name: "Patients",
        icon: UserRound,
        path: "/admin/patients",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/admin/settings",
    },
];

export default function AdminSidebar() {
    const location = useLocation();
    const { logout } = useAuthStore();

    return (
        <aside className="overflow-y-auto fixed left-0 top-0 z-20 flex h-screen w-72 flex-col bg-[#1E3D15] text-white shadow-xl">
            {/* Logo */}
            <div className="border-b border-green-800 px-8 py-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-700">
                        <img
                            src="/bagumbayan-logo.png"
                            alt="Bagumbayan Health Center"
                            className="h-10 w-10 object-contain"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold">
                            Bagumbayan HC
                        </h2>

                        <p className="text-sm text-green-200">
                            Admin Panel
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-green-300">
                    Main Menu
                </p>

                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const active =
                            location.pathname === item.path ||
                            (item.path !== "/admin" &&
                                location.pathname.startsWith(item.path));

                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                                        active
                                            ? "bg-green-800 shadow-md"
                                            : "text-green-100 hover:bg-green-800 hover:text-white"
                                    }`}
                                >
                                    <Icon size={20} />

                                    <span className="font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-green-800 p-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-green-100 transition hover:bg-red-600 hover:text-white"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}