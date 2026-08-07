import { Bell } from "lucide-react";
import { useSocket } from "../../../hooks/useSocket";
import type { PaginationState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import type { AdminNotification } from "../../../types/notification.type";
import { formatDate, promiseToast } from "../../../utils/utils";
import AppointmentModal from "../../Appointments/AppointmentModal";
import { type Appointment } from "../../../types/appointment.type";
import useReadAdminNotification from "../../../hooks/admin-notification/use-read-admin-notification.hook";
import useReadAllAdminNotifications from "../../../hooks/admin-notification/use-read-all-admin-notifications.hook";
import useGetAdminNotifications from "../../../hooks/admin-notification/use-get-admin-notifications.hook";

export default function AdminNotificationBell() {
    const readNotificationMutation = useReadAdminNotification();
    const readAllNotificationMutation = useReadAllAdminNotifications();

    const [unread, setUnread] = useState(0);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 10,
        pageIndex: 0,
    });

    const [showModal, setShowModal] = useState(false);
    const [appointment, setAppointment] = useState<Appointment>();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data } = useGetAdminNotifications({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    useSocket({
        namespace: "/admin-notification",
        events: {
            "admin-notification": (notification: AdminNotification) => {
                setNotifications((prev) => [notification, ...prev]);
                setUnread((prev) => prev + 1);
            },
        },
    });

    useEffect(() => {
        if (data) {
            setUnread(data.unread);

            setNotifications((prev) =>
                pagination.pageIndex === 0
                    ? data.adminNotifications
                    : [...prev, ...data.adminNotifications]
            );
        }

        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [data]);

    const handleRead = (notification : AdminNotification) => {
        setShowModal(true);
        setAppointment(notification.appointment);

        if(!notification.isRead){
            setUnread(prev => prev - 1);
            setNotifications(prev => prev.map(notif => 
                notif.id === notification.id ? ({ ...notif, isRead: true }) : notif
            ))
            readNotificationMutation.mutate(notification.id);
        }
    }

    const handleReadAll = () => {
        promiseToast(readAllNotificationMutation.mutateAsync(), "top-center", () => {
            setUnread(0);
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        });
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <AppointmentModal 
                close={() => setShowModal(false)}
                appointment={appointment}
                show={showModal}
            />
            {/* Bell */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative flex items-center justify-center rounded-full p-2.5 transition hover:bg-green-50 border border-gray-300 cursor-pointer"
            >
                <Bell size={22} className="text-[#1E3D15]" />

                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 z-20 mt-3 w-[400px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-300 px-5 py-4 bg-white">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Notifications
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                {unread} unread notification
                                {unread !== 1 && "s"}
                            </p>
                        </div>

                        {unread > 0 && (
                            <button 
                                onClick={handleReadAll}
                                className="text-sm font-medium text-green-700 transition hover:text-green-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="max-h-[420px] overflow-y-auto bg-gray-50 p-3 space-y-3">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14">
                                <Bell
                                    size={42}
                                    className="mb-3 text-gray-300"
                                />

                                <h3 className="font-medium text-gray-700">
                                    No notifications
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    You're all caught up.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleRead(notification)}
                                    className={`w-full rounded-xl border border-gray-300 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                        notification.isRead
                                            ? "border-gray-200 bg-white hover:bg-gray-50"
                                            : "border-gray-200 border-l-4 border-l-green-600 bg-green-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                                notification.isRead
                                                    ? "bg-gray-100"
                                                    : "bg-green-100"
                                            }`}
                                        >
                                            <Bell
                                                size={18}
                                                className={
                                                    notification.isRead
                                                        ? "text-gray-500"
                                                        : "text-green-700"
                                                }
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-sm leading-6 text-gray-800">
                                                    {notification.message}
                                                </p>

                                                {!notification.isRead && (
                                                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-green-600 flex-shrink-0" />
                                                )}
                                            </div>

                                            <p className="mt-2 text-xs text-gray-400">
                                                {formatDate(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border border-gray-300 bg-white p-3">
                            <button
                                onClick={() =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex: prev.pageIndex + 1,
                                    }))
                                }
                                disabled={
                                    !data ||
                                    notifications.length >= data.total
                                }
                                className="w-full rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700 transition hover:border-green-300 hover:bg-green-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                {data &&
                                notifications.length >= data.total
                                    ? "No More Notifications"
                                    : "See More"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}