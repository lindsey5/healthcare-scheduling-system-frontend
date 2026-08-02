import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetUpcomingAppointmentsResponse {
    upcomingAppointments: number;
}

const getUpcomingAppointments = () => 
    apiAxios<GetUpcomingAppointmentsResponse>('/api/appointments/upcoming', {
        method: 'GET',
    })

export default function useGetUpcomingAppointments () {
    return useQuery<GetUpcomingAppointmentsResponse, Error>({
        queryKey: ['appointments/upcoming'],
        queryFn: () => getUpcomingAppointments(),
        refetchOnWindowFocus: false
    })
}