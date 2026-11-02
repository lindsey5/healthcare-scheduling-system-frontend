import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Doctor } from "../../types/doctor.type";

type CancelAppointmentResponse = {
    doctor: Doctor;
    message: string;
}

const cancelAppointment = (id: string, reason: string) =>
    apiAxios<CancelAppointmentResponse>(`/api/appointments/cancel/${id}`, {
        method: "PATCH",
        data: { reason },
    })

export default function useCancelAppointment () {
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            cancelAppointment(id, reason),
    })
}