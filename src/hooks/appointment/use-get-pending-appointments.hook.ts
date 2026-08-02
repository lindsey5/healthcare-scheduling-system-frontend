import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetPendingAppointmentsResponse {
    pendingAppointments: number;
}

const getPendingppointments = () => 
    apiAxios<GetPendingAppointmentsResponse>('/api/appointments/pending', {
        method: 'GET',
    })

export default function useGetPendingAppointments () {
    return useQuery<GetPendingAppointmentsResponse, Error>({
        queryKey: ['appointments/pending'],
        queryFn: () => getPendingppointments(),
        refetchOnWindowFocus: false
    })
}