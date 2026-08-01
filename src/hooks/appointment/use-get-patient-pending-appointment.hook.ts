import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetPatientPendingAppointmentsResponse {
    pendingAppointments: number;
}

const getPatientPendingAppointments = () => 
    apiAxios<GetPatientPendingAppointmentsResponse>('/api/appointments/pending/patient', {
        method: 'GET',
    })

export default function useGetPatientPendingAppointments () {
    return useQuery<GetPatientPendingAppointmentsResponse, Error>({
        queryKey: ['appointments/pending/patient'],
        queryFn: () => getPatientPendingAppointments(),
        refetchOnWindowFocus: false
    })
}