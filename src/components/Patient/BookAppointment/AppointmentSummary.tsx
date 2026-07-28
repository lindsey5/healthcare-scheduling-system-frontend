import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowLeft, ArrowRight, User, CalendarDays } from "lucide-react";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import type { AppointmentRecordFormData } from "../../../schemas/appointmentRecordSchema";
import type { AppointmentFormData } from "../../../schemas/appointmentSchema";
import type { Doctor } from "../../../types/doctor.type";
import type { Service } from "../../../types/service.type";
import useCreateAppointment from "../../../hooks/appointment/use-create-appointment.hook";
import { promiseToast } from "../../../utils/utils";

interface AppointmentSummaryProps {
    prev: () => void;
    next: () => void;
    patientInfo: AppointmentRecordFormData;
    appointmentInfo: AppointmentFormData;
    doctor: Doctor | null;
    service: Service | null;
    setReferenceNumber: Dispatch<SetStateAction<string | undefined>>;
}

export default function AppointmentSummary({
    prev,
    next,
    setReferenceNumber,
    patientInfo,
    appointmentInfo,
    service,
    doctor
}: AppointmentSummaryProps) {
    const createAppointmentMutation = useCreateAppointment();
    const [confirmed, setConfirmed] = useState(false);

    const handleSubmit = () => {
        promiseToast(createAppointmentMutation.mutateAsync({
            appointment: appointmentInfo,
            appointmentRecord: {
                ...patientInfo,
                suffix: patientInfo.suffix === 'N/A' ? undefined : patientInfo.suffix
            }
        }), "top-center", (data) => {
            setReferenceNumber(data.appointment.referenceNumber);
            next();
        })
    }

    return (
        <Card className="p-6 space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#1E3D15]">
                    Appointment Summary
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Please review your information before submitting your appointment.
                </p>
            </div>


            {/* Patient Information */}
            <SummarySection
                title="Patient Information"
                icon={<User size={20} fill="#1E3D15" />}
            >
                <SummaryRow
                    label="Full Name"
                    value={`${patientInfo.firstName} ${
                        patientInfo.middleName ?? ""
                    } ${patientInfo.lastName} ${
                        patientInfo.suffix === "N/A"
                            ? ""
                            : patientInfo.suffix
                    }`}
                />

                <SummaryRow
                    label="Birth Date"
                    value={patientInfo.birthDate}
                />

                <SummaryRow
                    label="Gender"
                    value={patientInfo.gender}
                />

                <SummaryRow
                    label="Civil Status"
                    value={patientInfo.civilStatus}
                />

                <SummaryRow
                    label="Contact Number"
                    value={patientInfo.contactNumber}
                />

                <SummaryRow
                    label="Email"
                    value={patientInfo.email || "N/A"}
                />

                <SummaryRow
                    label="Complete Address"
                    value={patientInfo.completeAddress}
                />

                <SummaryRow
                    label="Emergency Contact"
                    value={
                        patientInfo.emergencyContactPerson
                            ? `${patientInfo.emergencyContactPerson} ${
                                  patientInfo.emergencyContactNumber ?? ""
                              }`
                            : "N/A"
                    }
                />
            </SummarySection>


            {/* Appointment Information */}
            <SummarySection
                title="Appointment Information"
                icon={<CalendarDays size={20} />}
            >
                <SummaryRow
                    label="Appointment Date"
                    value={appointmentInfo.appointmentDate}
                />

                <SummaryRow
                    label="Appointment Time"
                    value={appointmentInfo.appointmentTime}
                />

                <SummaryRow
                    label="Service"
                    value={service?.serviceName}
                />

                <SummaryRow
                    label="Doctor"
                    value={
                        doctor
                            ? `Dr. ${doctor.firstname} ${doctor.lastname}`
                            : "N/A"
                    }
                />

                <SummaryRow
                    label="Purpose of Visit"
                    value={appointmentInfo.purposeOfVisit}
                />
            </SummarySection>


            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 border-t border-gray-200 pt-5">

                <input
                    type="checkbox"
                    id="confirmation"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#1E3D15] cursor-pointer"
                />

                <div className="space-y-1">
                    <label
                        htmlFor="confirmation"
                        className="text-md cursor-pointer font-semibold text-[#1E3D15]"
                    >
                        I confirm that all information provided is true and correct.
                    </label>

                    <p className="text-sm text-gray-500 leading-relaxed">
                        By submitting this appointment, I understand that my request
                        is subject to approval by the Barangay Health Center.
                    </p>
                </div>

            </div>


            {/* Buttons */}
            <div className="flex justify-between pt-5 border-t border-gray-200">

                <Button
                    className="px-6 flex items-center gap-3 bg-white border border-[#1E3D15] text-[#1E3D15] hover:bg-[#1E3D15] hover:text-white"
                    onClick={prev}
                    type="button"
                >
                    <ArrowLeft size={18} />
                    Back
                </Button>


                <Button
                    className="px-6 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={!confirmed || createAppointmentMutation.isPending}
                    onClick={handleSubmit}
                >
                    Submit Appointment
                    <ArrowRight size={18}/>
                </Button>

            </div>

        </Card>
    );
}


function SummarySection({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {

    return (
        <div className="space-y-3">

            <h2 className="flex items-center gap-2 text-xl font-bold text-[#1E3D15]">
                {icon}
                {title}
            </h2>


            <div className="border-t border-gray-200">

                <table className="w-full text-sm">

                    <tbody>
                        {children}
                    </tbody>

                </table>

            </div>

        </div>
    );
}


function SummaryRow({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {

    return (
        <tr className="border-b border-gray-200">

            <td className="w-[40%] bg-gray-50 px-4 py-3 font-bold text-[#1E3D15]">
                {label}
            </td>


            <td className="px-4 py-3 text-gray-800 break-words">
                {value || "N/A"}
            </td>

        </tr>
    );
}