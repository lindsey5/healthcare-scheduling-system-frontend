import { CalendarDays, User, X } from "lucide-react";
import type { Appointment } from "../../../types/appointment.type";
import SummarySection from "../../shared/SummarySection";
import Card from "../../ui/Card";
import Modal from "../../ui/Modal";
import SummaryRow from "../../shared/SummaryRow";
import { formatTime } from "../../../utils/utils";

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
    return (
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
                </SummarySection>
            </Card>
        </Modal>
    );
}