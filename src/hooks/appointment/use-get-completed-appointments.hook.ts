import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetCompletedAppointmentsResponse {
    completedAppointments: number;
}

const getCompletedAppointments = () => 
    apiAxios<GetCompletedAppointmentsResponse>('/api/appointments/completed', {
        method: 'GET',
    })

export default function useGetCompletedAppointments () {
    return useQuery<GetCompletedAppointmentsResponse, Error>({
        queryKey: ['appointments/completed'],
        queryFn: () => getCompletedAppointments(),
        refetchOnWindowFocus: false
    })
}