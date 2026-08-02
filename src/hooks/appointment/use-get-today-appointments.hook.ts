import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetTodayAppointmentsResponse {
    todayAppointments: number;
}

const getTodayppointments = () => 
    apiAxios<GetTodayAppointmentsResponse>('/api/appointments/today', {
        method: 'GET',
    })

export default function useGetTodayAppointments () {
    return useQuery<GetTodayAppointmentsResponse, Error>({
        queryKey: ['appointments/today'],
        queryFn: () => getTodayppointments(),
        refetchOnWindowFocus: false
    })
}