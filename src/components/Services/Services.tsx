import { memo, useCallback, useState } from "react";
import { Clock, Pencil, Trash2 } from "lucide-react";

import useGetServices from "../../hooks/service/use-get-services.hook";
import { cn, formatTime, promiseToast } from "../../utils/utils";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { DAYS } from "../../lib/contants/constants";
import type { Service } from "../../types/service.type";
import ServiceModal from "./ServiceModal";
import useDeleteService from "../../hooks/service/use-delete-service.hook";

export default function Services() {
    const deleteServiceMutation = useDeleteService();
    const [showModal, setShowModal] = useState(false);
    const [service, setService] = useState<Service | null>(null);

    const handleClose = useCallback(() => {
        setShowModal(false);
        setService(null);
    }, []);

    const handleOpen = useCallback((service: Service) => {
        setService(service);
        setShowModal(true);
    }, []);

    const handleCreate = useCallback(() => {
        setService(null);
        setShowModal(true);
    }, []);

    const handleDelete = useCallback((id: number) => {
        const isConfirm = confirm('Are you sure do you want to delete this service?');

        if(!isConfirm) return;

        promiseToast(deleteServiceMutation.mutateAsync(id))
    }, [])

    return (
        <div className="p-6 flex-1 flex flex-col gap-10 min-h-screen overflow-auto">
            <ServiceModal
                close={handleClose}
                service={service}
                show={showModal}
            />

            <div className="w-full flex justify-between flex-wrap items-center gap-5">
                <h1 className="text-3xl font-bold text-[#1E3D15]">
                    Healthcare Services
                </h1>

                <Button onClick={handleCreate}>
                    Create Service
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 flex-1">
                {DAYS.map((day) => (
                    <ServicesContainer
                        key={day}
                        dayOfWeek={day}
                        handleOpen={handleOpen}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}

const ServicesContainer = memo(function ServicesContainer({
    dayOfWeek,
    handleOpen,
    handleDelete
}: {
    dayOfWeek: string;
    handleOpen: (service: Service) => void;
    handleDelete: (id: number) => void;
}) {
    const { data, isFetching } = useGetServices(dayOfWeek);

    const services: Service[] = data?.services ?? [];

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
    });

    const isToday = today === dayOfWeek;

    return (
        <Card
            className={cn(
                "transition-all",
                isToday && "border border-black"
            )}
        >
            {isToday && (
                <div className="flex justify-center -mt-7 mb-2">
                    <span className="bg-[#1E3D15] text-white text-xs font-semibold px-4 py-1 rounded-full shadow">
                        TODAY
                    </span>
                </div>
            )}

            <div className="rounded-xl py-3 text-center text-lg font-bold bg-[#2F7D20] text-white">
                {dayOfWeek}
            </div>

            <div className="mt-4 space-y-3">
                {isFetching ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-300 p-4 animate-pulse"
                        >
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-4 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))
                ) : services.length > 0 ? (
                    services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            openModal={handleOpen}
                            handleDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center text-gray-500">
                        No services available.
                    </div>
                )}
            </div>
        </Card>
    );
});

const ServiceCard = memo(function ServiceCard({
    service,
    openModal,
    handleDelete,
}: {
    service: Service;
    openModal: (service: Service) => void;
    handleDelete: (id: number) => void;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex">
                <div className="w-1.5 bg-green-500 rounded-l-xl" />

                <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 leading-tight">
                            {service.serviceName}
                        </h3>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={15} />
                        <span>
                            {formatTime(service.startTime)} -{" "}
                            {formatTime(service.endTime)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        <button
                            type="button"
                            onClick={() => openModal(service)}
                            className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                            aria-label="Edit service"
                        >
                            <Pencil size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDelete(service.id)}
                            className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete service"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});