import { useState } from "react";

import type { Service } from "../../types/service.type";
import type { ScheduleFormData } from "../../schemas/doctorSchema";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Dropdown from "../../components/ui/Dropdown";
import Modal from "../../components/ui/Modal";

import useGetAvailableServices from "../../hooks/doctor/use-get-available-services.hook";

interface AddServiceProps {
    show: boolean;
    close: () => void;
    handleAdd: (service: Service | null) => void;
    doctorServices: number[];
    schedules: ScheduleFormData[];
}

export default function AddService({
    show,
    handleAdd,
    close,
    doctorServices,
    schedules,
}: AddServiceProps) {
    const [selectedService, setSelectedService] =
        useState<Service | null>(null);

    const { data, isLoading } = useGetAvailableServices({
        schedules: schedules.map((schedule) => ({
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
        })),
    });

    const availableServices =
        data?.services
            .filter(
                (service) =>
                    !doctorServices.includes(service.id)
            )
            .sort((a, b) =>
                a.serviceName.localeCompare(b.serviceName)
            ) ?? [];

    return (
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="space-y-5 max-h-[80%] overflow-auto">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    Add Service
                </h1>

                <Dropdown
                    className="text-sm"
                    label="Select Service"
                    placeholder={
                        isLoading
                            ? "Loading services..."
                            : "Select Service"
                    }
                    disabled={isLoading}
                    options={availableServices.map(
                        (service) => ({
                            label: service.serviceName,
                            value: service.id,
                        })
                    )}
                    onChange={(e) => {
                        const service =
                            data?.services.find(
                                (service) =>
                                    service.id ===
                                    Number(e.target.value)
                            ) ?? null;

                        setSelectedService(service);
                    }}
                />

                <Button
                    type="button"
                    className="text-sm px-4 py-2"
                    onClick={() =>
                        handleAdd(selectedService)
                    }
                    disabled={!selectedService}
                >
                    Add Service
                </Button>
            </Card>
        </Modal>
    );
}