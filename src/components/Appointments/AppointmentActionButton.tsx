import Button from "../ui/Button";
import type { Appointment } from "../../types/appointment.type";

interface AppointmentActionButtonsProps {
    appointment?: Appointment;
    handleUpdate: (id: string, status: string) => void;
    handleReschedule: (id: string) => void;
    disabled?: boolean;
}

export default function AppointmentActionButtons({
    appointment,
    handleReschedule,
    handleUpdate,
    disabled
}: AppointmentActionButtonsProps) {
    if (!appointment) return null;

    switch (appointment.status) {
        case "Pending":
            return (
                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={disabled}
                        variant="success"
                        onClick={() =>
                            handleUpdate(appointment.id, "Approved")
                        }
                    >
                        Approve
                    </Button>

                    <Button
                        disabled={disabled}
                        variant="danger"
                        onClick={() =>
                            handleUpdate(appointment.id, "Rejected")
                        }
                    >
                        Reject
                    </Button>
                </div>
            );

        case "Approved":
            return (
                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={disabled}
                        variant="primary"
                        onClick={() =>
                            handleUpdate(appointment.id, "Checked In")
                        }
                    >
                        Check In
                    </Button>

                    <Button
                        disabled={disabled}
                        variant="secondary"
                        onClick={() =>
                            handleReschedule(appointment.id)
                        }
                    >
                        Reschedule
                    </Button>

                    <Button
                        disabled={disabled}
                        variant="warning"
                        onClick={() =>
                            handleUpdate(appointment.id, "No Show")
                        }
                    >
                        No Show
                    </Button>

                    <Button
                        disabled={disabled}
                        variant="danger"
                        onClick={() =>
                            handleUpdate(appointment.id, "Cancelled")
                        }
                    >
                        Cancel
                    </Button>
                </div>
            );

        case "Rescheduled":
        case "Checked In":
            return (
                <Button
                    disabled={disabled}
                    variant="success"
                    onClick={() =>
                        handleUpdate(appointment.id, "Completed")
                    }
                >
                    Complete
                </Button>
            );

        case "Completed":
        case "Cancelled":
        case "Rejected":
        case "No Show":
        default:
            return null;
    }
}