import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { GetAppointmentsResponse, GetAppointmentsParams } from "../../types/appointment.type";

const getMyAppointments = (params : GetAppointmentsParams) => 
    apiAxios<GetAppointmentsResponse>('/api/appointments/me', {
        method: 'GET',
        params
    })

export default function useGetMyAppointments (params : GetAppointmentsParams) {
    return useQuery<GetAppointmentsResponse, Error>({
        queryKey: ['appointments/me', params],
        queryFn: () => getMyAppointments(params),
        refetchOnWindowFocus: false
    })
}