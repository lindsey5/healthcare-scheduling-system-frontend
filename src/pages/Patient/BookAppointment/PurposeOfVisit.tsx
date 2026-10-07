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
import { ArrowRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Doctor } from "../../../types/doctor.type";
import type { Service } from "../../../types/service.type";

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
                    onChange={(e) => {
                        const date = e.target.value;

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
                        errors.appointmentDate?.message
                    }
                />

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
                        onChange={(e) =>
                            setValue(
                                "doctorId",
                                Number(
                                    e.target.value
                                )
                            )
                        }
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
                            setValue(
                                "appointmentTime",
                                e.target.value
                            )
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