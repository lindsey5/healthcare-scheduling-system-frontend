import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type GetAvailableTimeSlotResponse = {
    availableTimes: string[];
}

const getAvailableTimeSlot = (appointmentDate: string) => 
    apiAxios<GetAvailableTimeSlotResponse>(`/api/appointments/available-time`, {
        method: "GET",
        params: {
            appointmentDate
        }
    })

export default function useGetgetAvailableTimeSlot (appointmentDate : string) {
    return useQuery<GetAvailableTimeSlotResponse, Error>({
        queryKey: [`appointments/availableTime`, appointmentDate],
        queryFn: () => getAvailableTimeSlot(appointmentDate),
        refetchOnWindowFocus: false
    })
}