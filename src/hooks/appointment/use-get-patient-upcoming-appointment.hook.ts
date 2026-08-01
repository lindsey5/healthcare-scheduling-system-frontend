import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetPatientUpcomingAppointmentsResponse {
    upcomingAppointments: number;
}

const getPatientUpcomingAppointments = () => 
    apiAxios<GetPatientUpcomingAppointmentsResponse>('/api/appointments/upcoming/patient', {
        method: 'GET',
    })

export default function useGetPatientUpcomingAppointments () {
    return useQuery<GetPatientUpcomingAppointmentsResponse, Error>({
        queryKey: ['appointments/upcoming/patient'],
        queryFn: () => getPatientUpcomingAppointments(),
        refetchOnWindowFocus: false
    })
}