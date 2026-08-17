import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Appointment } from "../../types/appointment.type";

type RescheduleAppointmentResponse = {
    appointment: Appointment;
    message?: string;
}

type RescheduleAppointmentDTO = {
    newDoctorId: number;
    newAppointmentDate: string;
    newAppointmentTime: string;
    reason: string;
}

const rescheduleAppointment = (data: RescheduleAppointmentDTO, id: string) => 
    apiAxios<RescheduleAppointmentResponse>(`/api/appointments/reschedule/${id}`, {
        method: "PATCH",
        data
    })

export default function useRescheduleAppointment () {
    return useMutation({
        mutationFn: ({ 
            data,
            id
        } : {
            data : RescheduleAppointmentDTO,
            id: string
        }) => rescheduleAppointment(data, id),
    })
}