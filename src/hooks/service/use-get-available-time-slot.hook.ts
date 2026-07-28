import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type GetAvailableTimeSlotResponse = {
    availableTimes: {
        startTime: string;
        endTime: string;
    } [];
}

type GetAvailableTimeSlotParams = {
    appointmentDate: string;
}

const getAvailableTimeSlot = (serviceId: number, params : GetAvailableTimeSlotParams) => 
    apiAxios<GetAvailableTimeSlotResponse>(`/api/services/${serviceId}/available-time`, {
        method: "GET",
        params,
    })

export default function useGetgetAvailableTimeSlot ({
    serviceId,
    appointmentDate
} : { 
    serviceId: number,
    appointmentDate: string
}) {
    return useQuery<GetAvailableTimeSlotResponse, Error>({
        queryKey: [`services/${serviceId}/availableTime`, appointmentDate],
        queryFn: () => getAvailableTimeSlot(serviceId, { appointmentDate }),
        refetchOnWindowFocus: false
    })
}