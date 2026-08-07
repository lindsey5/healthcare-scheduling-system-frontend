import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type ReadAllAdminNotificationsResponse = {
    message: string;
}

const readAllAdminNotifications = () => 
    apiAxios<ReadAllAdminNotificationsResponse>(`/api/admin-notifications/read`, {
        method: "PATCH",
    })

export default function useReadAllAdminNotifications () {
    return useMutation({
        mutationFn: () => readAllAdminNotifications(),
    })
}