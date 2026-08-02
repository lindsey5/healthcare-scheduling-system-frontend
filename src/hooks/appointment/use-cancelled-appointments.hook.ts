import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetCancelledAppointmentsResponse {
    cancelledAppointments: number;
}

const getCancelledAppointments = () =>
    apiAxios<GetCancelledAppointmentsResponse>("/api/appointments/cancelled",{
        method: "GET",
    });

export default function useGetCancelledAppointments() {
    return useQuery<GetCancelledAppointmentsResponse, Error>({
        queryKey: ["appointments/cancelled"],
        queryFn: () => getCancelledAppointments(),
        refetchOnWindowFocus: false,
    });
}