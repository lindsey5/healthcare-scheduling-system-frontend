import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type ReadAllPatientNotificationsResponse = {
    message: string;
}

const readAllPatientNotifications = () => 
    apiAxios<ReadAllPatientNotificationsResponse>(`/api/patient-notifications/read`, {
        method: "PATCH",
    })

export default function useReadAllPatientNotifications () {
    return useMutation({
        mutationFn: () => readAllPatientNotifications(),
    })
}