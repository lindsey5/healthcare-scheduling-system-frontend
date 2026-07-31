import { Clock } from "lucide-react";
import useGetServices from "../../hooks/service/use-get-services.hook";
import { cn, formatTime } from "../../utils/utils";
import Card from "../ui/Card";
import { DAYS } from "../../lib/contants/constants";
import type { Service } from "../../types/service.type";

export default function Services() {
    return (
        <section className="py-5 flex-1 flex flex-col min-h-200">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1E3D15]">
                    Available Services
                </h1>

                <p className="text-gray-500 mt-2">
                    Browse the healthcare services available each day.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 flex-1">
                {DAYS.map((day) => (
                    <ServicesContainer
                        key={day}
                        dayOfWeek={day}
                    />
                ))}
            </div>
        </section>
    );
}

function ServicesContainer({
    dayOfWeek,
}: {
    dayOfWeek: string;
}) {
    const { data, isFetching } = useGetServices(dayOfWeek,);

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
                ) : services.length ? (
                    services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
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
}

function ServiceCard({
    service,
}: {
    service: Service;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex">
                <div className="w-1.5 bg-green-500 rounded-l-xl" />

                <div className="flex-1 p-4">
                    <h3 className="font-semibold text-gray-800 leading-tight">
                        {service.serviceName}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Clock size={15} />

                        <span>
                            {formatTime(service.startTime)} - {formatTime(service.endTime)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}