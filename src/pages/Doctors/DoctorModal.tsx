import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useCreateDoctor from "../../hooks/doctor/use-create-doctor.hook";
import useUpdateDoctor from "../../hooks/doctor/use-update-doctor.hook";
import type { Doctor } from "../../types/doctor.type";
import { doctorSchema, type DoctorFormData } from "../../schemas/doctorSchema";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Textfield from "../../components/ui/Textfield";
import Button from "../../components/ui/Button";
import Dropdown from "../../components/ui/Dropdown";
import { DAYS } from "../../lib/constants/constants";
import useGetServices from "../../hooks/service/use-get-services.hook";
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
    const { data: servicesData, isLoading: isLoadingServices } = useGetServices();
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        register,
        setValue,
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: { firstname: "", lastname: "", serviceIds: [] },
    });
    const serviceIds = useWatch({ control, name: "serviceIds" }) ?? [];
    const services = servicesData?.services ?? [];

    useEffect(() => {
        reset({
            firstname: doctor?.firstname ?? "",
            lastname: doctor?.lastname ?? "",
            serviceIds:
                doctor?.offeredServices?.map((assignment) => assignment.serviceId) ??
                [],
        });
    }, [doctor, show, reset]);

    const onSubmit = (data: DoctorFormData) => {
        if (!confirm(`Are you sure you want to ${doctor ? "update" : "create"} this doctor?`)) {
            return;
        }

        promiseToast(
            doctor
                ? updateDoctorMutation.mutateAsync({ data, id: doctor.id })
                : createDoctorMutation.mutateAsync(data)
        );
    };

    return (
        <Modal onClose={close} open={show}>
            <Card className="relative space-y-5 max-h-[80%] overflow-auto">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    {doctor ? "Edit" : "Create"} Doctor
                </h1>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <Textfield
                        label="First Name"
                        registration={register("firstname")}
                        placeholder="Enter first name"
                        error={errors.firstname?.message}
                    />
                    <Textfield
                        label="Last Name"
                        registration={register("lastname")}
                        placeholder="Enter last name"
                        error={errors.lastname?.message}
                    />

                    <section className="space-y-3">
                        <div>
                            <h2 className="font-semibold text-gray-800">
                                Services this doctor can offer
                            </h2>
                            <p className="text-sm text-gray-500">
                                Assign services only. Configure this doctor&apos;s service hours in the Services panel.
                            </p>
                        </div>

                        {serviceIds.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {serviceIds.map((serviceId) => {
                                    const service = services.find(
                                        (item) => item.id === serviceId
                                    );
                                    return (
                                        <div
                                            key={serviceId}
                                            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2"
                                        >
                                            <span className="text-sm">
                                                {service
                                                    ? `${service.serviceName} - ${service.dayOfWeek}`
                                                    : "Service"}
                                            </span>
                                            <button
                                                type="button"
                                                className="text-sm text-red-600 hover:text-red-800"
                                                onClick={() =>
                                                    setValue(
                                                        "serviceIds",
                                                        serviceIds.filter(
                                                            (id) => id !== serviceId
                                                        ),
                                                        { shouldValidate: true }
                                                    )
                                                }
                                                aria-label="Remove offered service"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {errors.serviceIds?.message && (
                            <p className="text-sm text-red-500">
                                {errors.serviceIds.message}
                            </p>
                        )}

                        <Dropdown
                            label="Add a service"
                            placeholder={
                                isLoadingServices ? "Loading services..." : "Select service"
                            }
                            disabled={isLoadingServices}
                            value=""
                            options={services
                                .filter((service) => !serviceIds.includes(service.id))
                                .sort((a, b) => {
                                    const dayOrder =
                                        DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
                                    return dayOrder || a.serviceName.localeCompare(b.serviceName);
                                })
                                .map((service) => ({
                                    label: `${service.serviceName} - ${service.dayOfWeek}`,
                                    value: service.id,
                                }))}
                            onChange={(event) =>
                                setValue(
                                    "serviceIds",
                                    [...serviceIds, Number(event.target.value)],
                                    { shouldValidate: true }
                                )
                            }
                        />
                    </section>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                createDoctorMutation.isPending ||
                                updateDoctorMutation.isPending
                            }
                        >
                            {doctor ? "Save Changes" : "Create Doctor"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
}
