import { useForm } from "react-hook-form";
import { serviceSchema, type ServiceFormData } from "../../schemas/serviceSchema";
import type { Service } from "../../types/service.type";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useEffect, useMemo } from "react";
import Dropdown from "../../components/ui/Dropdown";
import Button from "../../components/ui/Button";
import { DAYS } from "../../lib/contants/constants";
import useCreateService from "../../hooks/service/use-create-service.hook";
import useUpdateService from "../../hooks/service/use-update-service.hook";
import { promiseToast } from "../../utils/utils";
import Textfield from "../../components/ui/Textfield";

interface ServiceModalProps {
    service: Service | null;
    show: boolean;
    close: () => void;
}

const timeSlots = [
    { label: "8:00 AM", value: "08:00:00" },
    { label: "9:00 AM", value: "09:00:00" },
    { label: "10:00 AM", value: "10:00:00" },
    { label: "11:00 AM", value: "11:00:00" },
    { label: "12:00 PM", value: "12:00:00" },
    { label: "1:00 PM", value: "13:00:00" },
    { label: "2:00 PM", value: "14:00:00" },
    { label: "3:00 PM", value: "15:00:00" },
    { label: "4:00 PM", value: "16:00:00" },
];

function ServiceModal ({
    close,
    service,
    show
} : ServiceModalProps) {
    const createServiceMutation = useCreateService();
    const updateServiceMutation = useUpdateService();

    const { 
        formState: { errors }, 
        handleSubmit, 
        setValue,
        watch, 
        reset,
        register
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema)
    })

    const onSubmit = (data : ServiceFormData) => {
        const isConfirm = confirm(`Are you sure you want to ${service ? 'update' : 'create'} this service?`);

        if(!isConfirm) return;

        promiseToast(service ? updateServiceMutation.mutateAsync({ data, id: service.id}) : createServiceMutation.mutateAsync(data))

    }

    const startTime = watch("startTime");

    const endTimeOptions = useMemo(() => {
        if (!startTime) return timeSlots;

        return timeSlots.filter((time) => time.value > startTime);
    }, [startTime]);

    useEffect(() => {
        if (service) {
            reset({
                serviceName: service.serviceName,
                dayOfWeek: service.dayOfWeek,
                startTime: service.startTime,
                endTime: service.endTime,
            });
        }else {
            reset({
                serviceName: "",
                dayOfWeek: "",
                startTime: "",
                endTime: ""
            })
        }
    }, [service, show, reset]);

    return (
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="space-y-5">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    {service ? 'Edit' : 'Create'} Service
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
                        value={watch('dayOfWeek')}
                        options={DAYS.map(day => ({ label: day, value: day }))}
                        error={errors.dayOfWeek?.message}
                        onChange={(e) => setValue("dayOfWeek", e.target.value)}
                    />
                    <div className="justify-between flex items-center gap-3">
                        <Dropdown
                            label="Start Time"
                            placeholder="Select Start Time"
                            value={watch('startTime')}
                            options={timeSlots}
                            onChange={(e) => {
                                setValue("startTime", e.target.value);
                                setValue("endTime", "");
                            }}
                            error={errors.startTime?.message}
                        />
                        <div className="w-3 bg-gray-700 mt-5 h-[2px]"/>
                        <Dropdown
                            label="End Time"
                            placeholder="Select End Time"
                            options={endTimeOptions}
                            value={watch('endTime')}
                            onChange={(e) => setValue("endTime", e.target.value)}
                            disabled={!watch("startTime")}
                            error={errors.endTime?.message}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={createServiceMutation.isPending || updateServiceMutation.isPending}>
                            {service ? "Save Changes" : "Create Service"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    )
}

export default memo(ServiceModal);