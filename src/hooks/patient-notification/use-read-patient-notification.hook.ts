import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PatientNotification } from "../../types/notification.type";

type ReadPatientNotificationResponse = {
    patientNotification: PatientNotification;
}

const readPatientNotification = (id: number) => 
    apiAxios<ReadPatientNotificationResponse>(`/api/patient-notifications/read/${id}`, {
        method: "PATCH",
    })

export default function useReadPatientNotification () {
    return useMutation({
        mutationFn: (id: number) => readPatientNotification(id),
    })
}