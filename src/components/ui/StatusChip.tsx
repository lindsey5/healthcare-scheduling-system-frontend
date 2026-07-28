import { cn } from "../../utils/utils";

interface AppointmentStatusChipProps {
    status:
        | "Pending"
        | "Approved"
        | "Checked In"
        | "Completed"
        | "Cancelled"
        | "No Show"
        | "Rescheduled";
}

const statusStyles = {
    Pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200",

    Approved:
        "bg-blue-100 text-blue-800 border-blue-200",

    "Checked In":
        "bg-cyan-100 text-cyan-800 border-cyan-200",

    Completed:
        "bg-green-100 text-green-800 border-green-200",

    Cancelled:
        "bg-red-100 text-red-800 border-red-200",

    "No Show":
        "bg-gray-100 text-gray-700 border-gray-300",

    Rescheduled:
        "bg-purple-100 text-purple-800 border-purple-200",
} as const;

export default function AppointmentStatusChip({
    status,
}: AppointmentStatusChipProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                statusStyles[status]
            )}
        >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-70" />
            {status}
        </span>
    );
}