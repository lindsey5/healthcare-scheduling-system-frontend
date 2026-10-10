import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DoctorsDropdown from "../../components/shared/DoctorsDropdown";
import AvailableTimeSlotDropdown from "../../components/shared/AvailableTimeSlotDropdown";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Textfield from "../../components/ui/Textfield";
import Button from "../../components/ui/Button";
import Dropdown from "../../components/ui/Dropdown";
import Textarea from "../../components/ui/Textarea";

import {
    rescheduleAppointmentSchema,
    type RescheduleAppointmentFormData,
} from "../../schemas/appointmentSchema";

import type { Appointment } from "../../types/appointment.type";
import useRescheduleAppointment from "../../hooks/appointment/use-reschedule-appointment.hook";
import { promiseToast } from "../../utils/utils";

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

export default function RescheduleAppointmentModal({
    appointment,
    show,
    close,
}: RescheduleAppointmentModalProps) {
    const rescheduleMutation = useRescheduleAppointment();

    const [selectedReason, setSelectedReason] = useState("");

    const {
        formState: { errors },
        handleSubmit,
        watch,
        setValue,
        register,
        setError,
        clearErrors,
    } = useForm<RescheduleAppointmentFormData>({
        resolver: zodResolver(rescheduleAppointmentSchema),
        defaultValues: {
            newAppointmentDate: "",
            newAppointmentTime: "",
            newDoctorId: undefined,
            reason: "",
        },
    });

    const newAppointmentDate = watch("newAppointmentDate");
    const newDoctorId = watch("newDoctorId");

    // Example: "Monday", "Tuesday", or "Friday"
    const serviceDayOfWeek = appointment?.service?.dayOfWeek;

    // Get the weekday for the selected date.
    // Parse YYYY-MM-DD as a local date to avoid timezone shifts.
    const selectedDayOfWeek = newAppointmentDate
        ? (() => {
              const [year, month, day] = newAppointmentDate
                  .split("-")
                  .map(Number);

              return new Date(year, month - 1, day).toLocaleDateString(
                  "en-US",
                  {
                      weekday: "long",
                  }
              );
          })()
        : null;

    // Compare weekday names without considering capitalization or whitespace.
    const isValidServiceDay =
        !newAppointmentDate ||
        !serviceDayOfWeek ||
        selectedDayOfWeek?.trim().toLowerCase() ===
            String(serviceDayOfWeek).trim().toLowerCase();

    useEffect(() => {
        if (appointment) {
            setValue("newDoctorId", appointment.doctorId);
        }
    }, [appointment, setValue]);

    // Validate the selected date against the service's weekday.
    useEffect(() => {
        if (!newAppointmentDate || !serviceDayOfWeek) {
            clearErrors("newAppointmentDate");
            return;
        }

        if (!isValidServiceDay) {
            setError("newAppointmentDate", {
                type: "validate",
                message: `This service is only available on ${serviceDayOfWeek}. Please select the correct day.`,
            });
        } else {
            clearErrors("newAppointmentDate");
        }
    }, [
        newAppointmentDate,
        serviceDayOfWeek,
        isValidServiceDay,
        setError,
        clearErrors,
    ]);

    const onSubmit = async (data: RescheduleAppointmentFormData) => {
        if (!isValidServiceDay) {
            return;
        }

        const isConfirm = confirm(
            "Are you sure you want to reschedule this appointment?"
        );

        if (!isConfirm) {
            return;
        }

        await promiseToast(
            rescheduleMutation.mutateAsync({
                data,
                id: appointment?.id || "",
            })
        );
    };

    const minDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
    });

    return (
        <Modal onClose={close} open={show}>
            <Card className="max-h-[90vh] overflow-y-auto">
                <form
                    className="space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-2xl font-bold text-[#1E3D15]">
                        Reschedule Appointment
                    </h1>

                    <div>
                        <p className="text-sm text-gray-500">
                            {appointment?.referenceNumber}
                        </p>

                        <p className="text-sm text-gray-500">
                            Service: {appointment?.service?.serviceName}
                        </p>

                        {serviceDayOfWeek && (
                            <p className="mt-1 text-sm text-gray-500">
                                Service day: {serviceDayOfWeek}
                            </p>
                        )}
                    </div>

                    <Textfield
                        label="New Appointment Date"
                        type="date"
                        registration={register("newAppointmentDate")}
                        value={newAppointmentDate}
                        min={minDate}
                        error={errors.newAppointmentDate?.message}
                    />

                    {newAppointmentDate && selectedDayOfWeek && (
                        <p
                            className={`-mt-3 text-sm ${
                                isValidServiceDay
                                    ? "text-green-700"
                                    : "text-red-600"
                            }`}
                        >
                            Selected day: {selectedDayOfWeek}
                            {!isValidServiceDay &&
                                ` — This service is only available on ${serviceDayOfWeek}.`}
                        </p>
                    )}

                    <DoctorsDropdown
                        onChange={(e) =>
                            setValue("newDoctorId", Number(e.target.value), {
                                shouldValidate: true,
                            })
                        }
                        value={newDoctorId}
                        serviceId={appointment?.serviceId ?? 0}
                        error={errors.newDoctorId?.message}
                    />

                    <AvailableTimeSlotDropdown
                        label="New Appointment Time"
                        appointmentDate={newAppointmentDate}
                        error={errors.newAppointmentTime?.message}
                        value={watch("newAppointmentTime")}
                        onChange={(e) =>
                            setValue("newAppointmentTime", e.target.value, {
                                shouldValidate: true,
                            })
                        }
                        serviceId={appointment?.serviceId ?? 0}
                        doctorId={newDoctorId}
                    />

                    <Dropdown
                        label="Reason for Rescheduling"
                        options={rescheduleReasons.map((reason) => ({
                            label: reason,
                            value: reason,
                        }))}
                        onChange={(e) => {
                            const reason = e.target.value;

                            if (reason === "Other") {
                                setValue("reason", "", {
                                    shouldValidate: true,
                                });
                            } else {
                                setValue("reason", reason, {
                                    shouldValidate: true,
                                });
                            }

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
                        disabled={
                            !isValidServiceDay ||
                            rescheduleMutation.isPending
                        }
                    >
                        {rescheduleMutation.isPending
                            ? "Rescheduling..."
                            : "Submit"}
                    </Button>
                </form>
            </Card>
        </Modal>
    );
}