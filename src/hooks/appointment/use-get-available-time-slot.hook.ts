import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type GetAvailableTimeSlotResponse = {
    availableTimes: string[];
}

type GetAvailableTimeSlotParams = {
    appointmentDate : string;
    serviceId: number;
}

const getAvailableTimeSlot = ({ appointmentDate, serviceId } : GetAvailableTimeSlotParams) => 
    apiAxios<GetAvailableTimeSlotResponse>(`/api/appointments/available-time`, {
        method: "GET",
        params: {
            appointmentDate,
            serviceId
        }
    })

export default function useGetgetAvailableTimeSlot (params : GetAvailableTimeSlotParams) {
    return useQuery<GetAvailableTimeSlotResponse, Error>({
        queryKey: [`appointments/available-time`, params],
        queryFn: () => getAvailableTimeSlot(params),
        refetchOnWindowFocus: false
    })
}