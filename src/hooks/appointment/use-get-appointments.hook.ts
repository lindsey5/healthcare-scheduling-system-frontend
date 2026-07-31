import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { GetAppointmentsResponse, GetAppointmentsParams } from "../../types/appointment.type";

const getAppointments = (params : GetAppointmentsParams) => 
    apiAxios<GetAppointmentsResponse>('/api/appointments', {
        method: 'GET',
        params
    })

export default function useGetAppointments (params : GetAppointmentsParams) {
    return useQuery<GetAppointmentsResponse, Error>({
        queryKey: ['appointments', params],
        queryFn: () => getAppointments(params),
        refetchOnWindowFocus: false
    })
}