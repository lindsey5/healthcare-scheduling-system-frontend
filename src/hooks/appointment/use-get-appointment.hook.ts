import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Appointment } from "../../types/appointment.type";

type GetAppointmentResponse = {
    appointment: Appointment
}

const getAppointment = (referenceNumber: string) => 
    apiAxios<GetAppointmentResponse>(`/api/appointments/${referenceNumber}`, {
        method: 'GET',
    })

export default function useGetAppointment (referenceNumber: string) {
    return useQuery<GetAppointmentResponse, Error>({
        queryKey: ['appointment', referenceNumber],
        queryFn: () => getAppointment(referenceNumber),
        refetchOnWindowFocus: false
    })
}