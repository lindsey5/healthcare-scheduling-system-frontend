import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetPatientCompletedAppointmentsResponse {
    completedAppointments: number;
}

const getPatientCompletedAppointments = () => 
    apiAxios<GetPatientCompletedAppointmentsResponse>('/api/appointments/completed/patient', {
        method: 'GET',
    })

export default function useGetPatientCompletedAppointments () {
    return useQuery<GetPatientCompletedAppointmentsResponse, Error>({
        queryKey: ['appointments/completed/patient'],
        queryFn: () => getPatientCompletedAppointments(),
        refetchOnWindowFocus: false
    })
}