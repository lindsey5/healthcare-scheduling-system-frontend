import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";

type AppointmentStatusReasonModalProps = {
    open: boolean;
    status: "Cancelled" | "Rejected";
    disabled?: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
};

export default function AppointmentStatusReasonModal({
    open,
    status,
    disabled = false,
    onClose,
    onSubmit,
}: AppointmentStatusReasonModalProps) {
    const [reason, setReason] = useState("");

    const action = status === "Rejected" ? "reject" : "cancel";
    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Card className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-[#1E3D15]">
                        {status === "Rejected"
                            ? "Reject Appointment"
                            : "Cancel Appointment"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Provide a reason for the patient.
                    </p>
                </div>

                <Textarea
                    label="Reason *"
                    rows={4}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength={1000}
                    placeholder={`Why is this appointment being ${action}ed?`}
                    required
                />

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={disabled}
                    >
                        Back
                    </Button>
                    <Button
                        variant="danger"
                        disabled={disabled || !reason.trim()}
                        onClick={() => onSubmit(reason.trim())}
                    >
                        {status === "Rejected" ? "Reject" : "Cancel"}
                    </Button>
                </div>
            </Card>
        </Modal>
    );
}
