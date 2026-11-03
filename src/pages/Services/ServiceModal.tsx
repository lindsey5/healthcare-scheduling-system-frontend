import { memo, useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Dropdown from "../../components/ui/Dropdown";
import Button from "../../components/ui/Button";
import Textfield from "../../components/ui/Textfield";
import { DAYS, scheduleTimeSlots } from "../../lib/contants/constants";
import type { Service } from "../../types/service.type";
import useCreateService from "../../hooks/service/use-create-service.hook";
import useUpdateService from "../../hooks/service/use-update-service.hook";
import useGetDoctors from "../../hooks/doctor/use-get-doctors.hook";
import { serviceSchema, type ServiceFormData } from "../../schemas/serviceSchema";
import { promiseToast } from "../../utils/utils";

interface ServiceModalProps {
    service: Service | null;
    show: boolean;
    close: () => void;
}

function ServiceModal({ close, service, show }: ServiceModalProps) {
    const createServiceMutation = useCreateService();
    const updateServiceMutation = useUpdateService();
    const { data: doctorsData, isLoading: isLoadingDoctors } = useGetDoctors({});

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        reset,
        setValue,
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            serviceName: "",
            dayOfWeek: "",
            startTime: "",
            endTime: "",
            doctors: [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "doctors",
    });
    const schedules = useWatch({ control, name: "doctors" });
    const dayOfWeek = useWatch({ control, name: "dayOfWeek" });
    const serviceStartTime = useWatch({ control, name: "startTime" });
    const serviceEndTime = useWatch({ control, name: "endTime" });
    const activeDoctors = doctorsData?.doctors ?? [];
    const offeredDoctors = activeDoctors.filter((doctor) =>
        doctor.offeredServices?.some(
            (assignment) => assignment.serviceId === service?.id
        )
    );

    useEffect(() => {
        reset({
            serviceName: service?.serviceName ?? "",
            dayOfWeek: service?.dayOfWeek ?? "",
            startTime: service?.startTime ?? "",
            endTime: service?.endTime ?? "",
            doctors:
                service?.doctorServices?.map((assignment) => ({
                    doctorId: assignment.doctorId,
                    startTime: assignment.startTime,
                    endTime: assignment.endTime,
                })) ?? [],
        });
    }, [service, show, reset]);

    const onSubmit = (data: ServiceFormData) => {
        if (!confirm(`Are you sure you want to ${service ? "update" : "create"} this service?`)) {
            return;
        }

        const request = service
            ? updateServiceMutation.mutateAsync({ data, id: service.id })
            : createServiceMutation.mutateAsync(data);
        promiseToast(request);
    };

    return (
        <Modal onClose={close} open={show}>
            <Card className="space-y-5 max-h-[80vh] overflow-auto">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    {service ? "Edit" : "Create"} Service
                </h1>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <Textfield
                        label="Service Name"
                        registration={register("serviceName")}
                        placeholder="Enter service name"
                        error={errors.serviceName?.message}
                    />
                    <Dropdown
                        label="Available Day"
                        placeholder="Select Day"
                        value={dayOfWeek}
                        options={DAYS.map((day) => ({ label: day, value: day }))}
                        error={errors.dayOfWeek?.message}
                        onChange={(event) =>
                            setValue(
                                "dayOfWeek",
                                event.target.value,
                                { shouldValidate: true }
                            )
                        }
                    />
                    <div className="flex items-start gap-3">
                        <Dropdown
                            label="Service start time"
                            placeholder="Select start time"
                            value={serviceStartTime}
                            options={scheduleTimeSlots.filter(
                                (time) =>
                                    !serviceEndTime || time.value < serviceEndTime
                            )}
                            error={errors.startTime?.message}
                            onChange={(event) => {
                                const nextStartTime = event.target.value;
                                setValue("startTime", nextStartTime, {
                                    shouldValidate: true,
                                });
                                schedules.forEach((schedule, index) => {
                                    if (
                                        schedule.startTime &&
                                        schedule.startTime < nextStartTime
                                    ) {
                                        setValue(`doctors.${index}.startTime`, "", {
                                            shouldValidate: true,
                                        });
                                        setValue(`doctors.${index}.endTime`, "", {
                                            shouldValidate: true,
                                        });
                                    }
                                });
                            }}
                        />
                        <Dropdown
                            label="Service end time"
                            placeholder="Select end time"
                            value={serviceEndTime}
                            options={scheduleTimeSlots.filter(
                                (time) =>
                                    !serviceStartTime || time.value > serviceStartTime
                            )}
                            error={errors.endTime?.message}
                            onChange={(event) => {
                                const nextEndTime = event.target.value;
                                setValue("endTime", nextEndTime, {
                                    shouldValidate: true,
                                });
                                schedules.forEach((schedule, index) => {
                                    if (
                                        schedule.endTime &&
                                        schedule.endTime > nextEndTime
                                    ) {
                                        if (schedule.startTime >= nextEndTime) {
                                            setValue(`doctors.${index}.startTime`, "", {
                                                shouldValidate: true,
                                            });
                                            setValue(`doctors.${index}.endTime`, "", {
                                                shouldValidate: true,
                                            });
                                        } else {
                                            setValue(`doctors.${index}.endTime`, "", {
                                                shouldValidate: true,
                                            });
                                        }
                                    }
                                });
                            }}
                        />
                    </div>

                    <section className="space-y-3">
                        <div>
                            <h2 className="font-semibold text-gray-800">
                                Assigned doctors and service hours
                            </h2>
                            <p className="text-sm text-gray-500">
                                Doctor assignments are optional. Assigned doctors&apos; hours must fall within the service hours, and appointment availability follows each doctor&apos;s schedule.
                            </p>
                            {!service && (
                                <p className="text-sm text-amber-700">
                                    Save this new service first, assign it to doctors in the Doctors panel, then edit it here to configure their hours.
                                </p>
                            )}
                        </div>

                        {fields.map((field, index) => {
                            const selectedDoctorId = schedules[index]?.doctorId;
                            const startTime = schedules[index]?.startTime;
                            const endTime = schedules[index]?.endTime;
                            const otherSchedules = schedules.filter(
                                (schedule, scheduleIndex) =>
                                    scheduleIndex !== index &&
                                    Boolean(schedule.startTime) &&
                                    Boolean(schedule.endTime)
                            );
                            const overlapsAnotherSchedule = (
                                candidateStart: string,
                                candidateEnd: string
                            ) =>
                                otherSchedules.some(
                                    (schedule) =>
                                        candidateStart < schedule.endTime &&
                                        schedule.startTime < candidateEnd
                                );
                            const startTimeOptions = scheduleTimeSlots.filter((time) => {
                                if (
                                    (serviceStartTime && time.value < serviceStartTime) ||
                                    (serviceEndTime && time.value >= serviceEndTime)
                                ) {
                                    return false;
                                }

                                if (endTime) {
                                    return (
                                        time.value < endTime &&
                                        !overlapsAnotherSchedule(time.value, endTime)
                                    );
                                }

                                return scheduleTimeSlots.some(
                                    (possibleEnd) =>
                                        possibleEnd.value > time.value &&
                                        (!serviceEndTime ||
                                            possibleEnd.value <= serviceEndTime) &&
                                        !overlapsAnotherSchedule(
                                            time.value,
                                            possibleEnd.value
                                        )
                                );
                            });
                            const endTimeOptions = scheduleTimeSlots.filter(
                                (time) =>
                                    startTime &&
                                    time.value > startTime &&
                                    (!serviceEndTime ||
                                        time.value <= serviceEndTime) &&
                                    !overlapsAnotherSchedule(startTime, time.value)
                            );
                            const availableDoctors = offeredDoctors.filter(
                                (doctor) =>
                                    doctor.id === selectedDoctorId ||
                                    !schedules.some(
                                        (schedule, scheduleIndex) =>
                                            scheduleIndex !== index &&
                                            schedule.doctorId === doctor.id
                                    )
                            );

                            return (
                                <div
                                    key={field.id}
                                    className="rounded-xl border border-gray-200 p-3 space-y-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <Dropdown
                                            label="Doctor"
                                            placeholder={
                                                isLoadingDoctors
                                                    ? "Loading doctors..."
                                                    : "Select Doctor"
                                            }
                                            value={selectedDoctorId || ""}
                                            disabled={isLoadingDoctors}
                                            options={availableDoctors.map((doctor) => ({
                                                label: `Dr. ${doctor.firstname} ${doctor.lastname}`,
                                                value: doctor.id,
                                            }))}
                                            error={errors.doctors?.[index]?.doctorId?.message}
                                            onChange={(event) =>
                                                setValue(
                                                    `doctors.${index}.doctorId`,
                                                    Number(event.target.value),
                                                    { shouldValidate: true }
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="mt-9 text-sm text-red-600 hover:text-red-800"
                                            onClick={() => remove(index)}
                                            aria-label="Remove assigned doctor"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Dropdown
                                            label="Start time"
                                            placeholder="Select start time"
                                            value={startTime}
                                            options={startTimeOptions}
                                            error={errors.doctors?.[index]?.startTime?.message}
                                            onChange={(event) => {
                                                setValue(
                                                    `doctors.${index}.startTime`,
                                                    event.target.value,
                                                    { shouldValidate: true }
                                                );
                                                if (event.target.value >= endTime) {
                                                    setValue(
                                                        `doctors.${index}.endTime`,
                                                        "",
                                                        { shouldValidate: true }
                                                    );
                                                }
                                            }}
                                        />
                                        <Dropdown
                                            label="End time"
                                            placeholder="Select end time"
                                            value={endTime}
                                            options={endTimeOptions}
                                            disabled={!startTime}
                                            error={errors.doctors?.[index]?.endTime?.message}
                                            onChange={(event) =>
                                                setValue(
                                                    `doctors.${index}.endTime`,
                                                    event.target.value,
                                                    { shouldValidate: true }
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {errors.doctors?.message && (
                            <p className="text-sm text-red-500">
                                {errors.doctors.message}
                            </p>
                        )}
                        {service && offeredDoctors.length === 0 && !isLoadingDoctors && (
                            <p className="text-sm text-amber-700">
                                No doctors currently offer this service. Assign it to a doctor in the Doctors panel first.
                            </p>
                        )}
                        {service && offeredDoctors.length > schedules.length && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoadingDoctors}
                                onClick={() =>
                                    append({ doctorId: 0, startTime: "", endTime: "" })
                                }
                            >
                                Add Doctor
                            </Button>
                        )}
                    </section>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                createServiceMutation.isPending ||
                                updateServiceMutation.isPending
                            }
                        >
                            {service ? "Save Changes" : "Create Service"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
}

export default memo(ServiceModal);
