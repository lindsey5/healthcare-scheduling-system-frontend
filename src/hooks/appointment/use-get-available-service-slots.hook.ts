import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type AvailableServiceSlotsResponse = {
    services: {
        serviceId: number;
        serviceName: string;
        availableSlots: number;
    }[];
};

const getAvailableServiceSlots = (appointmentDate: string) =>
    apiAxios<AvailableServiceSlotsResponse>(
        "/api/appointments/available-service-slots",
        {
            method: "GET",
            params: { appointmentDate },
        }
    );

export default function useGetAvailableServiceSlots(appointmentDate?: string) {
    return useQuery<AvailableServiceSlotsResponse, Error>({
        queryKey: ["appointments/available-service-slots", appointmentDate],
        queryFn: () => getAvailableServiceSlots(appointmentDate!),
        enabled: Boolean(appointmentDate),
        refetchOnWindowFocus: false,
    });
}
