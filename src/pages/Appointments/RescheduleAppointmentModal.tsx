import { zodResolver } from "@hookform/resolvers/zod";
import DoctorsDropdown from "../../components/shared/DoctorsDropdown";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { rescheduleAppointmentSchema, type RescheduleAppointmentFormData } from "../../schemas/appointmentSchema";
import type { Appointment } from "../../types/appointment.type";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Textfield from "../../components/ui/Textfield";
import AvailableTimeSlotDropdown from "../../components/shared/AvailableTimeSlotDropdown";
import useRescheduleAppointment from "../../hooks/appointment/use-reschedule-appointment.hook";
import { promiseToast } from "../../utils/utils";
import Button from "../../components/ui/Button";
import Dropdown from "../../components/ui/Dropdown";
import Textarea from "../../components/ui/Textarea";

interface RescheduleAppointmentModalProps {
    show: boolean;
    close: () => void;
    appointment?: Appointment;
}

const rescheduleReasons = [
  "Doctor unavailable",
  "Doctor has an emergency",
  "Doctor's schedule changed",
  "Health center closure",
  "Service unavailable",
  "Scheduling conflict",
  "Overbooking",
  "System/scheduling error",
  "Other",
];

export default function RescheduleAppointmentModal ({
    appointment,
    show,
    close
} : RescheduleAppointmentModalProps) {
    const rescheduleMutation = useRescheduleAppointment();
    const [selectedReason, setSelectedReason] = useState("");
    const { 
        formState: { errors }, 
        handleSubmit, 
        watch, 
        setValue,
        register
    } = useForm<RescheduleAppointmentFormData>({
        resolver: zodResolver(rescheduleAppointmentSchema)
    })

    const onSubmit = (data: RescheduleAppointmentFormData) => {
        const isConfirm = confirm("Are you sure you want to reschedule this appointment?");

        if(!isConfirm) return;

        promiseToast(rescheduleMutation.mutateAsync({ data, id: appointment?.id || ""}))
    }

    useEffect(() => {
        if(appointment){
            setValue("newDoctorId", appointment.doctorId)
        }
    }, [appointment])


    return (
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="max-h-[90vh] overflow-y-auto">
                <form
                    className="space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-2xl font-bold text-[#1E3D15]">Reschedule Appointment</h1>
                    <div>
                        <p className="text-sm text-gray-500">{appointment?.referenceNumber}</p>
                        <p className="text-sm text-gray-500">Service: {appointment?.service.serviceName}</p>
                    </div>
                    <DoctorsDropdown 
                        onChange={(e) => setValue("newDoctorId", Number(e.target.value))}
                        value={watch('newDoctorId')}
                        serviceId={appointment?.serviceId ?? 0}
                        error={errors.newDoctorId?.message}
                    />
                    <Textfield 
                        label="New Appointment Date"
                        type="date"
                        registration={register('newAppointmentDate')}
                        value={watch('newAppointmentDate')}
                        min={new Date().toLocaleDateString("en-CA", {
                            timeZone: "Asia/Manila",
                        })}
                        error={errors.newAppointmentDate?.message}
                    />
                    <AvailableTimeSlotDropdown
                        label="New Appointment Time"
                        appointmentDate={watch("newAppointmentDate")}
                        error={errors.newAppointmentTime?.message}
                        value={watch('newAppointmentTime')}
                        onChange={(e) => setValue('newAppointmentTime', e.target.value)}
                        serviceId={appointment?.serviceId ?? 0}
                    />

                    <Dropdown 
                        label="Reason for Rescheduling"
                        options={rescheduleReasons.map(reason => ({ label: reason, value: reason }))}
                        onChange={(e) => {
                            const reason = e.target.value;
                            if(reason === 'Other')setValue("reason", "");
                            else setValue("reason", reason);

                            setSelectedReason(reason);
                        }}
                        value={selectedReason}
                        error={errors.reason?.message}
                    />

                    {selectedReason === "Other" && (
                        <Textarea
                            value={watch("reason")}
                            registration={register("reason")}
                            placeholder="Enter a reason"
                            rows={3}
                        />
                    )}
                
                    <Button 
                        className="w-full"
                        type="submit"
                    >Submit</Button>
                </form>
            </Card>
        </Modal>
    )



}