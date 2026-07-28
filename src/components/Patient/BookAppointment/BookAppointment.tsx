import { Check } from "lucide-react";
import { useState } from "react";
import PurposeOfVisit from "./PurposeOfVisit";
import { appointmentSchema, type AppointmentFormData } from "../../../schemas/appointmentSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalInformation from "./PersonalInfomation";
import { AppointmentRecordSchema, type AppointmentRecordFormData } from "../../../schemas/appointmentRecordSchema";
import { cn } from "../../../utils/utils";
import { type Doctor } from "../../../types/doctor.type";
import { type Service } from "../../../types/service.type";
import AppointmentSummary from "./AppointmentSummary";

const steps = [
    "Purpose of Visit",
    "Personal Information",
    "Appointment Summary",
    "Completed",
];

export default function BookAppointment() {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const { 
        formState: { errors : appointmentErrors }, 
        handleSubmit : appointmentHandleSubmit, 
        watch : appointmentWatch, 
        setValue : appointmentSetValue 
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema)
    })
    const { 
        register : appointmentRecordRegister, 
        formState: { errors : appointmentRecordErrors }, 
        handleSubmit : appointmentRecordHandleSubmit, 
        watch : appointmentRecordWatch, 
        setValue : appointmentRecordSetValue,
    } = useForm<AppointmentRecordFormData>({
        resolver: zodResolver(AppointmentRecordSchema)
    })

    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex(prev => prev + 1);

    const prev = () => setCurrentIndex(prev => prev - 1);

    return (
        <section className="bg-green-50 min-h-screen py-12 flex-1 px-6 space-y-6">
            {/* Stepper */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const completed = index < currentIndex;
                        const active = index === currentIndex;

                        return (
                            <div
                                key={step}
                                className="flex items-center flex-1 last:flex-none"
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                                            completed
                                                ? "bg-green-600 text-white"
                                                : active
                                                ? "bg-[#1E3D15] text-white ring-4 ring-green-100"
                                                : "bg-gray-100 text-gray-500 border border-gray-300"
                                        )}
                                    >
                                        {completed ? <Check size={20} /> : index + 1}
                                    </div>

                                    <p
                                        className={cn(
                                            "mt-3 text-sm font-medium text-center max-w-28",
                                            completed
                                                ? "text-green-600"
                                                : active
                                                ? "text-[#1E3D15]"
                                                : "text-gray-500"
                                        )}
                                    >
                                        {step}
                                    </p>
                                </div>

                                {index !== steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "flex-1 h-1 mx-4 rounded-full transition-all duration-300",
                                            completed
                                                ? "bg-green-600"
                                                : "bg-gray-200"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            {currentIndex === 0 && (
                <PurposeOfVisit 
                    errors={appointmentErrors}
                    handleSubmit={appointmentHandleSubmit}
                    next={next}
                    setValue={appointmentSetValue}
                    watch={appointmentWatch}
                    setSelectedDoctor={setSelectedDoctor}
                    setSelectedService={setSelectedService}
                />
            )}

            {currentIndex === 1 && (
                <PersonalInformation 
                    next={next}
                    prev={prev}
                    register={appointmentRecordRegister}
                    errors={appointmentRecordErrors}
                    handleSubmit={appointmentRecordHandleSubmit}
                    setValue={appointmentRecordSetValue}
                    watch={appointmentRecordWatch}
                />
            )}

            {currentIndex === 2 && (
                <AppointmentSummary 
                    prev={prev}
                    patientInfo={appointmentRecordWatch()}
                    appointmentInfo={appointmentWatch()}
                    doctor={selectedDoctor}
                    service={selectedService}
                />
            )}
        </section>
    );
}