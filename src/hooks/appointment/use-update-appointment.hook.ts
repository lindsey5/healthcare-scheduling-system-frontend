import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Appointment } from "../../types/appointment.type";

type UpdateAppointmentResponse = {
    appointment: Appointment;
    message: string;
}

const updateAppointment = (id: string, status: string) => 
    apiAxios<UpdateAppointmentResponse>(`/api/appointments/status/${id}`, {
        method: "PATCH",
        data: {
            status
        }
    })

export default function useUpdateAppointment () {
    return useMutation({
        mutationFn: ({ status, id } : { status: string, id: string }) => updateAppointment(id, status),
    })
}