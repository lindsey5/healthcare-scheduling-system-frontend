import { CalendarDays, QrCode, User, X } from "lucide-react";
import type { Appointment } from "../../../types/appointment.type";
import SummarySection from "../../../components/shared/SummarySection";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import SummaryRow from "../../../components/shared/SummaryRow";
import { formatDate, formatTime, promiseToast } from "../../../utils/utils";
import Button from "../../../components/ui/Button";
import useCancelAppointment from "../../../hooks/appointment/use-cancel-appointment.hook";
import { useState } from "react";
import QRCodeModal from "./QRCodeModal";

interface AppointmentModalProps {
    show: boolean;
    close: () => void;
    appointment?: Appointment;
}

export default function AppointmentModal({
    close,
    show,
    appointment,
}: AppointmentModalProps) {
    const [showQr, setShowQr] = useState(false);
    const cancelAppointmentMutation = useCancelAppointment();

    const handleCancel = () => {
        const isConfirm = confirm("Are you sure you want to cancel this appointment?");

        if(!isConfirm) return;

        promiseToast(cancelAppointmentMutation.mutateAsync(appointment?.id || ""));
    }

    return (
        <>
        <Modal
            onClose={close}
            open={show}
            className="max-w-[90vw] w-200 h-screen flex flex-col justify-center"
        >
            <Card className="relative w-full space-y-10 max-h-[80%] overflow-auto">
                {/* Close Button */}
                <button
                    onClick={close}
                    className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <SummarySection
                    title="Appointment Information"
                    icon={<CalendarDays size={20} />}
                >
                    <SummaryRow
                        label="Reference Number"
                        value={appointment?.referenceNumber}
                    />

                    <SummaryRow
                        label="Booked By"
                        value={`${appointment?.patient.firstname} ${appointment?.patient.lastname} - ${appointment?.patient.email}`}
                    />

                    <SummaryRow
                        label="Appointment Date"
                        value={appointment?.appointmentDate}
                    />

                    <SummaryRow
                        label="Appointment Time"
                        value={formatTime(appointment?.appointmentTime || "")}
                    />

                    <SummaryRow
                        label="Service"
                        value={appointment?.service.serviceName}
                    />

                    <SummaryRow
                        label="Doctor"
                        value={`Dr. ${appointment?.doctor.firstname} ${appointment?.doctor.lastname}`}
                    />

                    <SummaryRow
                        label="Purpose of Visit"
                        value={appointment?.purposeOfVisit}
                    />

                    <SummaryRow
                        label="Status"
                        value={appointment?.status}
                    />

                    <SummaryRow
                        label="Date Submitted"
                        value={formatDate(appointment?.createdAt) || ""}
                    />
                </SummarySection>

                <SummarySection
                    title="Patient Information"
                    icon={<User size={20} fill="#1E3D15" />}
                >
                    <SummaryRow
                        label="Full Name"
                        value={`${appointment?.appointmentRecord.firstName} ${
                            appointment?.appointmentRecord.middleName ?? ""
                        } ${appointment?.appointmentRecord.lastName} ${
                            appointment?.appointmentRecord.suffix ?? ""
                        }`}
                    />

                    <SummaryRow
                        label="Birth Date"
                        value={appointment?.appointmentRecord.birthDate}
                    />

                    <SummaryRow
                        label="Gender"
                        value={appointment?.appointmentRecord.gender}
                    />

                    <SummaryRow
                        label="Civil Status"
                        value={appointment?.appointmentRecord.civilStatus}
                    />

                    <SummaryRow
                        label="Contact Number"
                        value={appointment?.appointmentRecord.contactNumber}
                    />

                    <SummaryRow
                        label="Email"
                        value={appointment?.appointmentRecord.email || "N/A"}
                    />

                    <SummaryRow
                        label="Complete Address"
                        value={appointment?.appointmentRecord.completeAddress}
                    />

                    <SummaryRow
                        label="Emergency Contact"
                        value={
                            appointment?.appointmentRecord.emergencyContactPerson
                                ? `${appointment?.appointmentRecord.emergencyContactPerson} (${appointment?.appointmentRecord.emergencyContactNumber ?? ""})`
                                : "N/A"
                        }
                    />
                    <SummaryRow
                        label="Date Submitted"
                        value={formatDate(appointment?.createdAt)}
                    />
                </SummarySection>
                <div className="flex justify-end gap-3">
                    {['Pending', 'Approved', 'Rescheduled'].includes(appointment?.status || "") && (
                        <Button className="flex items-center gap-3" onClick={() => setShowQr(true)}>
                            <QrCode size={18} />
                            Show QR Code
                        </Button>
                    )}
                    {appointment?.status === 'Pending' && (
                        <Button
                            variant="danger"
                            onClick={handleCancel}
                            disabled={cancelAppointmentMutation.isPending}
                        >Cancel Appointment</Button>
                    )}
                </div>
            </Card>
        </Modal>
        <QRCodeModal 
            close={() => setShowQr(false)}
            show={showQr}
            referenceNumber={appointment?.referenceNumber || ""}
        />
        </>
    );
}