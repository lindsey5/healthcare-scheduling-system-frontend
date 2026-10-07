import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import useCreateDoctor from "../../hooks/doctor/use-create-doctor.hook";
import useUpdateDoctor from "../../hooks/doctor/use-update-doctor.hook";

import type { Doctor } from "../../types/doctor.type";
import type { Service } from "../../types/service.type";

import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Textfield from "../../components/ui/Textfield";
import Button from "../../components/ui/Button";

import AddService from "./AddService";
import AddSchedule from "./AddSchedule";

import {
    doctorSchema,
    type DoctorFormData,
    type ScheduleFormData,
} from "../../schemas/doctorSchema";

import { DAYS, timeSlots } from "../../lib/contants/constants";
import { promiseToast } from "../../utils/utils";

interface DoctorModalProps {
    show: boolean;
    doctor?: Doctor;
    close: () => void;
}

export default function DoctorModal({
    close,
    show,
    doctor,
}: DoctorModalProps) {
    const createDoctorMutation = useCreateDoctor();
    const updateDoctorMutation = useUpdateDoctor();

    const [showAddSchedule, setShowAddSchedule] = useState(false);
    const [showAddService, setShowAddService] = useState(false);
    const [assignedServices, setAssignedServices] = useState<Service[]>([]);

    const {
        formState: { errors },
        handleSubmit,
        reset,
        register,
        watch,
        setValue,
        getValues,
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            doctorServices: [],
            schedules: [],
        },
    });

    const schedules = watch("schedules");
    const doctorServices = watch("doctorServices");

    /*
     * Get unique days from the doctor's schedules.
     *
     * Example:
     * [
     *   { day: "Monday", ... },
     *   { day: "Wednesday", ... }
     * ]
     *
     * becomes:
     * ["Monday", "Wednesday"]
     */
    const scheduleDays = [
        ...new Set(schedules.map((schedule) => schedule.day)),
    ];

    const sortedSchedules = schedules
        .map((schedule, index) => ({
            schedule,
            index,
        }))
        .sort(
            (a, b) =>
                DAYS.indexOf(a.schedule.day) -
                DAYS.indexOf(b.schedule.day)
        );

    const onSubmit = (data: DoctorFormData) => {
        const isConfirm = confirm(
            `Are you sure you want to ${
                doctor ? "update" : "create"
            } this doctor?`
        );

        if (!isConfirm) return;

        promiseToast(
            doctor
                ? updateDoctorMutation.mutateAsync({
                      data,
                      id: doctor.id,
                  })
                : createDoctorMutation.mutateAsync(data)
        );
    };

    const handleRemoveService = (id: number) => {
        const updated = getValues("doctorServices").filter(
            (serviceId) => serviceId !== id
        );

        setAssignedServices((prev) =>
            prev.filter((service) => service.id !== id)
        );

        setValue("doctorServices", updated, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleAddService = (service: Service | null) => {
        if (!service) return;

        const isExisting = getValues("doctorServices").some(
            (serviceId) => serviceId === service.id
        );

        if (isExisting) {
            alert("This service has already been added.");
            return;
        }

        const newValues = [
            ...getValues("doctorServices"),
            service.id,
        ];

        setAssignedServices((prev) => [...prev, service]);

        setValue("doctorServices", newValues, {
            shouldValidate: true,
            shouldDirty: true,
        });

        setShowAddService(false);
    };

    const addSchedule = (data: ScheduleFormData) => {
        const currentSchedules = getValues("schedules");

        const isExisting = currentSchedules.some(
            (schedule) =>
                schedule.day === data.day &&
                schedule.startTime === data.startTime &&
                schedule.endTime === data.endTime
        );

        if (isExisting) {
            alert("This schedule has already been added.");
            return;
        }

        setValue(
            "schedules",
            [
                ...currentSchedules,
                data as DoctorFormData["schedules"][number],
            ],
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setShowAddSchedule(false);
    };

    const handleRemoveSchedule = (index: number) => {
        const currentSchedules = getValues("schedules");

        // Remove the selected schedule
        const updatedSchedules = currentSchedules.filter(
            (_, scheduleIndex) => scheduleIndex !== index
        );

        setValue("schedules", updatedSchedules, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // Get the remaining schedule days
        const remainingDays = [
            ...new Set(
                updatedSchedules.map((schedule) => schedule.day)
            ),
        ];

        /*
         * Remove services that are no longer available
         * on any of the remaining schedule days.
         *
         * Example:
         *
         * Schedules:
         * Monday
         * Wednesday
         *
         * Service:
         * Wednesday
         *
         * Remove Wednesday schedule
         * -> Service is automatically removed.
         */

        const validServices = assignedServices.filter((service) => {
            if (!service.dayOfWeek) {
                return false;
            }

            // If dayOfWeek is an array
            if (Array.isArray(service.dayOfWeek)) {
                return service.dayOfWeek.some((day) =>
                    remainingDays.includes(day)
                );
            }

            // If dayOfWeek is a single day
            return remainingDays.includes(
                service.dayOfWeek
            );
        });

        setAssignedServices(validServices);

        setValue(
            "doctorServices",
            validServices.map((service) => service.id),
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const getTimeLabel = (value: string) => {
        return (
            timeSlots.find((time) => time.value === value)?.label ??
            value
        );
    };

    useEffect(() => {
        if (doctor) {
            reset({
                firstname: doctor.firstname,
                lastname: doctor.lastname,
                doctorServices:
                    doctor.doctorServices?.map(
                        (service) => service.service.id
                    ) ?? [],
                schedules: doctor.doctorSchedules ?? [],
            });

            setAssignedServices(
                doctor.doctorServices?.map(
                    (service) => service.service
                ) ?? []
            );
        } else {
            reset({
                firstname: "",
                lastname: "",
                doctorServices: [],
                schedules: [],
            });

            setAssignedServices([]);
        }

        setShowAddSchedule(false);
        setShowAddService(false);
    }, [doctor, show, reset]);

    return (
        <Modal
            onClose={close}
            open={show}
            className="max-w-[90vw] w-200 h-screen flex flex-col justify-center"
        >
            <AddService
                close={() => setShowAddService(false)}
                show={showAddService}
                handleAdd={handleAddService}
                doctorServices={doctorServices}
                schedules={watch('schedules')}
            />

            <Card className="relative space-y-5 max-h-[80%] overflow-auto">
                {/* Close */}
                <button
                    type="button"
                    onClick={close}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer transition"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <div className="pr-10">
                    <h1 className="text-xl font-bold text-[#1E3D15]">
                        {doctor ? "Edit" : "Create"} Doctor
                    </h1>
                </div>

                <form
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Name */}
                    <div className="flex gap-3 w-full">
                        <Textfield
                            className="flex-1"
                            label="First Name"
                            registration={register("firstname")}
                            placeholder="Enter first name"
                            error={errors.firstname?.message}
                        />

                        <Textfield
                            className="flex-1"
                            label="Last Name"
                            registration={register("lastname")}
                            placeholder="Enter last name"
                            error={errors.lastname?.message}
                        />
                    </div>

                    {/* Schedules */}
                    <div className="space-y-3">
                        <h2 className="font-medium text-gray-700">
                            Schedules:
                        </h2>

                        {!showAddSchedule && (
                            <Button
                                type="button"
                                variant="outline"
                                className="text-sm w-full py-2"
                                onClick={() =>
                                    setShowAddSchedule(true)
                                }
                            >
                                Add Schedule
                            </Button>
                        )}

                        {showAddSchedule && (
                            <AddSchedule
                                onClose={() =>
                                    setShowAddSchedule(false)
                                }
                                onAdd={addSchedule}
                                existingDays={scheduleDays}
                            />
                        )}

                        {schedules.length > 0 && (
                            <div className="space-y-2">
                                {sortedSchedules.map(
                                    ({ schedule, index }) => (
                                        <div
                                            key={`${schedule.day}-${schedule.startTime}-${schedule.endTime}-${index}`}
                                            className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {schedule.day}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {getTimeLabel(
                                                        schedule.startTime
                                                    )}{" "}
                                                    -{" "}
                                                    {getTimeLabel(
                                                        schedule.endTime
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-gray-500 hover:text-red-500 cursor-pointer"
                                                onClick={() =>
                                                    handleRemoveSchedule(
                                                        index
                                                    )
                                                }
                                                aria-label="Remove schedule"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {errors.schedules?.message && (
                            <p className="text-sm text-red-500">
                                {errors.schedules.message}
                            </p>
                        )}
                    </div>

                    {/* Assigned Services */}
                    {schedules.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-medium text-gray-700">
                                Assigned Services
                            </h2>

                            {!doctorServices.length ? (
                                <p className="text-sm text-gray-500">
                                    No assigned services yet
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {assignedServices.map(
                                        (service) => (
                                            <div
                                                key={service.id}
                                                className="flex items-center gap-3 border px-2 py-1 border-gray-500 rounded-md"
                                            >
                                                <h2 className="text-sm">
                                                    {
                                                        service.serviceName
                                                    }
                                                </h2>

                                                <button
                                                    type="button"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        handleRemoveService(
                                                            service.id
                                                        )
                                                    }
                                                    aria-label="Remove service"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                className="flex gap-1 items-center text-sm bg-green-100 border border-green-800 px-2 py-1 rounded-md cursor-pointer"
                                onClick={() =>
                                    setShowAddService(true)
                                }
                            >
                                <Plus size={16} />
                                Add Service
                            </button>

                            {errors.doctorServices?.message && (
                                <p className="text-sm text-red-500">
                                    {errors.doctorServices.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={
                                updateDoctorMutation.isPending ||
                                createDoctorMutation.isPending
                            }
                        >
                            {doctor
                                ? "Save Changes"
                                : "Create Doctor"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
}