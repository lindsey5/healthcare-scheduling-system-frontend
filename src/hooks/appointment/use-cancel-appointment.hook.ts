import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Doctor } from "../../types/doctor.type";

type CancelAppointmentResponse = {
    doctor: Doctor;
    message: string;
}

const cancelAppointment = (id: string) => 
    apiAxios<CancelAppointmentResponse>(`/api/appointments/cancel/${id}`, {
        method: "PATCH",
    })

export default function useCancelAppointment () {
    return useMutation({
        mutationFn: (id : string) => cancelAppointment(id),
    })
}