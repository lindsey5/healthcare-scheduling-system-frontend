import ServicesDropdown from "./ServicesDropdown";
import Textfield from "../../../components/ui/Textfield";
import DoctorsDropdown from "../../../components/shared/DoctorsDropdown";
import { getDayOfWeek } from "../../../utils/utils";
import AvailableTimeSlotDropdown from "../../../components/shared/AvailableTimeSlotDropdown";
import Card from "../../../components/ui/Card";
import Textarea from "../../../components/ui/Textarea";
import type { AppointmentFormData } from "../../../schemas/appointmentSchema";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";
import Button from "../../../components/ui/Button";
import { AlertCircle, ArrowRight, CalendarCheck, CalendarX, Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Doctor } from "../../../types/doctor.type";
import type { Service } from "../../../types/service.type";
import { useState } from "react";
import { useAppointmentDateClosures } from "../../../hooks/appointment/use-appointment-date-closures.hook";
import useGetAvailableServiceSlots from "../../../hooks/appointment/use-get-available-service-slots.hook";
import { formatTime } from "../../../utils/utils";

interface PurposeOfVisitProps {
    next: () => void;
    setValue: UseFormSetValue<AppointmentFormData>;
    errors: FieldErrors<AppointmentFormData>;
    watch: UseFormWatch<AppointmentFormData>;
    handleSubmit: UseFormHandleSubmit<AppointmentFormData>;
    setSelectedDoctor: Dispatch<SetStateAction<Doctor | null>>;
    setSelectedService: Dispatch<SetStateAction<Service | null>>;
}

export default function PurposeOfVisit({
    next,
    setValue,
    errors,
    watch,
    handleSubmit,
    setSelectedDoctor,
    setSelectedService,
}: PurposeOfVisitProps) {
    const appointmentDate = watch("appointmentDate");
    const [closedDateError, setClosedDateError] = useState("");
    const {
        data: closuresData,
        isLoading: isClosuresLoading,
        isError: isClosuresError,
    } = useAppointmentDateClosures();
    const closuresByDate = new Map(
        (closuresData?.closures ?? []).map((closure) => [
            closure.closureDate,
            closure,
        ])
    );
    const selectedDateClosure = appointmentDate
        ? closuresByDate.get(appointmentDate)
        : undefined;

    /*
     * Get current date in Asia/Manila
     */
    const today = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Manila",
        })
    );

    /*
     * Current week starts Monday
     */
    const currentDay = today.getDay();

    // Monday = 1, Tuesday = 2, ..., Sunday = 7
    const dayFromMonday =
        currentDay === 0 ? 7 : currentDay;

    const currentWeekStart = new Date(today);

    currentWeekStart.setDate(
        today.getDate() - (dayFromMonday - 1)
    );

    currentWeekStart.setHours(0, 0, 0, 0);

    /*
     * Next week Sunday
     *
     * Current Monday + 13 days = next Sunday
     */
    const nextWeekEnd = new Date(currentWeekStart);

    nextWeekEnd.setDate(
        currentWeekStart.getDate() + 13
    );

    nextWeekEnd.setHours(23, 59, 59, 999);

    /*
     * Format date as YYYY-MM-DD
     */
    const formatDate = (date: Date) => {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const minAppointmentDate = formatDate(today);
    const maxAppointmentDate = formatDate(nextWeekEnd);

    /*
     * Get day of appointment
     */
    const appointmentDay = appointmentDate
        ? getDayOfWeek(appointmentDate)
        : undefined;
    const {
        data: availableServiceSlots,
        isFetching: isAvailableServiceSlotsFetching,
        isError: isAvailableServiceSlotsError,
    } = useGetAvailableServiceSlots(appointmentDate);

    const onSubmit = () => {
        next();
    };

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1E3D15]">
                    Purpose of Visit
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Please select your preferred healthcare service,
                    doctor, appointment schedule, and briefly describe
                    your concern.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                {/* Appointment Date */}
                <Textfield
                    label="Appointment Date *"
                    type="date"
                    className="bg-white"
                    min={minAppointmentDate}
                    max={maxAppointmentDate}
                    disabled={isClosuresLoading || isClosuresError}
                    onChange={(e) => {
                        const date = e.target.value;

                        const closure = closuresByDate.get(date);

                        if (
                            closure &&
                            closure.startTime === null &&
                            closure.endTime === null
                        ) {
                            setClosedDateError(
                                closure.reason
                                    ? `Appointments are unavailable for the full day: ${closure.reason}`
                                    : "Appointments are unavailable for the full day."
                            );
                            setValue("appointmentDate", "", {
                                shouldValidate: true,
                            });
                            setValue("serviceId", 0);
                            setValue("doctorId", 0);
                            setValue("appointmentTime", "");
                            setSelectedDoctor(null);
                            setSelectedService(null);
                            return;
                        }

                        setClosedDateError("");

                        /*
                         * Prevent Saturday and Sunday
                         */
                        const selectedDate = new Date(
                            `${date}T00:00:00`
                        );

                        const day =
                            selectedDate.getDay();

                        if (
                            day === 0 ||
                            day === 6
                        ) {
                            alert(
                                "Appointments are only available Monday to Friday."
                            );

                            setValue(
                                "appointmentDate",
                                "",
                                {
                                    shouldValidate: true,
                                }
                            );

                            return;
                        }

                        setValue(
                            "appointmentDate",
                            date,
                            {
                                shouldValidate: true,
                                shouldDirty: true,
                            }
                        );

                        // Reset dependent fields
                        setValue("serviceId", 0);
                        setValue("doctorId", 0);
                        setValue(
                            "appointmentTime",
                            ""
                        );

                        setSelectedDoctor(null);
                        setSelectedService(null);
                    }}
                    value={appointmentDate}
                    error={
                        isClosuresError
                            ? "Closed dates could not be loaded. Please refresh and try again."
                            : closedDateError ||
                            errors.appointmentDate?.message
                    }
                />
                {selectedDateClosure?.startTime &&
                    selectedDateClosure.endTime && (
                        <p className="-mt-3 text-sm text-amber-700">
                            Appointments are unavailable from{" "}
                            {formatTime(selectedDateClosure.startTime)} to{" "}
                            {formatTime(selectedDateClosure.endTime)}
                            {selectedDateClosure.reason
                                ? `: ${selectedDateClosure.reason}`
                                : "."}
                        </p>
                    )}


                {appointmentDate && (
                    <section
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        aria-live="polite"
                    >
                        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                <CalendarCheck size={18} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Appointment Capacity
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Remaining clinic-wide capacity for the selected date
                                </p>
                            </div>
                        </div>

                        <div className="p-5">
                            {isAvailableServiceSlotsFetching ? (
                                <div className="flex items-center gap-3 py-6 text-sm text-gray-500">
                                    <Loader2 size={18} className="animate-spin text-green-600" />
                                    Checking remaining capacity...
                                </div>
                            ) : isAvailableServiceSlotsError ? (
                                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                    <AlertCircle size={18} />
                                    Unable to load remaining capacity. Please try again.
                                </div>
                            ) : availableServiceSlots?.capacity ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {[
                                        {
                                            label: "Total remaining",
                                            value:
                                                availableServiceSlots.capacity.totalRemaining,
                                        },
                                        {
                                            label: "Morning remaining",
                                            value:
                                                availableServiceSlots.capacity.morningRemaining,
                                        },
                                        {
                                            label: "Afternoon remaining",
                                            value:
                                                availableServiceSlots.capacity.afternoonRemaining,
                                        },
                                    ].map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                                        >
                                            <p className="text-xs text-gray-500">{label}</p>
                                            <p
                                                className={`mt-1 text-2xl font-bold ${value > 0
                                                        ? "text-green-700"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <CalendarX size={22} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">
                                        No remaining capacity
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        The clinic has no remaining appointment capacity for
                                        this date.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}


                {/* Service */}
                <ServicesDropdown
                    setSelectedService={
                        setSelectedService
                    }
                    onChange={(e) => {
                        setValue(
                            "serviceId",
                            Number(e.target.value)
                        );

                        setValue("doctorId", 0);
                        setValue(
                            "appointmentTime",
                            ""
                        );

                        setSelectedDoctor(null);
                    }}
                    error={errors.serviceId?.message}
                    disabled={!appointmentDate}
                    value={
                        watch("serviceId") ||
                        undefined
                    }
                    dayOfWeek={appointmentDay}
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Doctor */}
                    <DoctorsDropdown
                        serviceId={watch("serviceId")}
                        dayOfWeek={appointmentDay}
                        disabled={
                            !watch("serviceId")
                        }
                        value={
                            watch("doctorId") ||
                            undefined
                        }
                        error={
                            errors.doctorId?.message
                        }
                        onChange={(e) => {
                            setValue(
                                "doctorId",
                                Number(
                                    e.target.value
                                )
                            );
                            setValue("appointmentTime", "");
                        }}
                        setSelectedDoctor={
                            setSelectedDoctor
                        }
                    />

                    {/* Time */}
                    <AvailableTimeSlotDropdown
                        appointmentDate={
                            appointmentDate
                        }
                        error={
                            errors.appointmentTime
                                ?.message
                        }
                        value={watch(
                            "appointmentTime"
                        )}
                        onChange={(e) =>
                            setValue("appointmentTime", e.target.value)
                        }
                        onPeriodChange={() =>
                            setValue("appointmentTime", "")
                        }
                        serviceId={watch("serviceId")}
                        doctorId={watch('doctorId')}
                        disabled={
                            !watch("serviceId")
                        }
                    />
                </div>

                {/* Purpose */}
                <Textarea
                    label="Purpose of Visit *"
                    rows={5}
                    error={
                        errors.purposeOfVisit?.message
                    }
                    value={watch(
                        "purposeOfVisit"
                    )}
                    onChange={(e) =>
                        setValue(
                            "purposeOfVisit",
                            e.target.value
                        )
                    }
                    placeholder="Briefly describe your illness, concern, or reason for your appointment"
                />

                <div className="flex justify-end">
                    <Button
                        className="px-6 flex gap-3 items-center"
                        type="submit"
                    >
                        Next
                        <ArrowRight size={20} />
                    </Button>
                </div>
            </form>
        </Card>
    );
}