import ServicesDropdown from "./ServicesDropdown";
import Textfield from "../../ui/Textfield";
import DoctorsDropdown from "./DoctorsDropdown";
import { getDayOfWeek } from "../../../utils/utils";
import AvailableTimeSlotDropdown from "./AvailableTimeSlotDropdown";
import Card from "../../ui/Card";
import Textarea from "../../ui/Textarea";
import type { AppointmentFormData } from "../../../schemas/appointmentSchema";
import type { FieldErrors, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from "react-hook-form";
import Button from "../../ui/Button";
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

export default function PurposeOfVisit ({ 
    next,
    setValue,
    errors,
    watch,
    handleSubmit,
    setSelectedDoctor,
    setSelectedService
} : PurposeOfVisitProps) {


    const onSubmit = () => {
        next();
    }

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1E3D15]">
                    Purpose of Visit
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Please select your preferred healthcare service, doctor, appointment schedule, and briefly describe your concern.
                </p>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <Textfield 
                    label="Appointment Date *"
                    type="date"
                    className="bg-white"
                    onChange={(e) => {
                        setValue('appointmentDate', e.target.value);
                        setValue('serviceId', 0);
                        setValue('doctorId', 0);
                        setValue('appointmentTime', "");
                        setSelectedDoctor(null);
                        setSelectedService(null);
                    }}
                    value={watch('appointmentDate')}
                    min={new Date().toLocaleDateString("en-CA", {
                        timeZone: "Asia/Manila",
                    })}
                    error={errors.appointmentDate?.message}
                />
                <ServicesDropdown 
                    setSelectedService={setSelectedService}
                    onChange={(e) => {
                        setValue('serviceId', Number(e.target.value));
                        setValue('doctorId', 0);
                        setSelectedDoctor(null);
                        setValue('appointmentTime', "");
                    }}
                    error={errors.serviceId?.message}
                    disabled={!watch('appointmentDate')}
                    value={watch('serviceId') || undefined}
                    dayOfWeek={getDayOfWeek(watch('appointmentDate'))}
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <DoctorsDropdown
                        serviceId={watch("serviceId")}
                        disabled={!watch("serviceId")}
                        value={watch("doctorId") || undefined}
                        error={errors.doctorId?.message}
                        onChange={(e) => setValue("doctorId", Number(e.target.value))}
                        setSelectedDoctor={setSelectedDoctor}
                    />

                    <AvailableTimeSlotDropdown
                        appointmentDate={watch("appointmentDate")}
                        error={errors.appointmentTime?.message}
                        value={watch('appointmentTime')}
                        onChange={(e) => setValue('appointmentTime', e.target.value)}
                        serviceId={watch('serviceId')}
                        disabled={!watch("serviceId")}
                    />
                </div>

                <Textarea 
                    label="Purpose of Visit *"
                    rows={5}
                    error={errors.purposeOfVisit?.message}
                    value={watch('purposeOfVisit')}
                    onChange={(e) => setValue("purposeOfVisit", e.target.value)}
                    placeholder="Briefly describe your illness, concern, or reason for your appointment"
                />
                <div className="flex justify-end">
                    <Button
                        className="px-6 flex gap-3 items-center"
                        type="submit"
                    >
                        Next
                        <ArrowRight size={20}/> 
                    </Button>
                </div>
            </form>
        
        </Card>
    )
}