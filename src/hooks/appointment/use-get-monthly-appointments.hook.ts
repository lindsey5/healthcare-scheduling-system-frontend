import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type GetMonthlyAppointmentsParams = {
    year?: number;
}

type GetMonthlyAppointmentsResponse = {
    monthlyAppointments: {
        month: string,
        totalAppointments: number;
    }[];
}

const getMonthlyAppointments = (params : GetMonthlyAppointmentsParams) => 
    apiAxios<GetMonthlyAppointmentsResponse>('/api/appointments/monthly', {
        method: 'GET',
        params
    })

export default function useGetMonthlyAppointments (params : GetMonthlyAppointmentsParams) {
    return useQuery<GetMonthlyAppointmentsResponse, Error>({
        queryKey: ['appointments/monthly', params],
        queryFn: () => getMonthlyAppointments(params),
        refetchOnWindowFocus: false
    })
}