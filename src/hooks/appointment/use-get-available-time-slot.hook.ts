import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type GetAvailableTimeSlotResponse = {
    availableTimes: string[];
    remainingSlots: number;
}

type GetAvailableTimeSlotParams = {
    appointmentDate : string;
    serviceId: number;
    doctorId: number;
    period: "morning" | "afternoon";
}

const getAvailableTimeSlot = (params : GetAvailableTimeSlotParams) => 
    apiAxios<GetAvailableTimeSlotResponse>(`/api/appointments/available-time`, {
        method: "GET",
        params
    })

export default function useGetgetAvailableTimeSlot (params : GetAvailableTimeSlotParams) {
    return useQuery<GetAvailableTimeSlotResponse, Error>({
        queryKey: [
            "appointments/available-time",
            params.appointmentDate,
            params.serviceId,
            params.doctorId,
            params.period,
        ],
        queryFn: () => getAvailableTimeSlot(params),
        enabled: Boolean(
            params.appointmentDate &&
            params.serviceId &&
            params.doctorId
        ),
        refetchOnWindowFocus: false,
        staleTime: 0,
    })
}