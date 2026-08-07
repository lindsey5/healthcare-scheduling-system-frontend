import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { AdminNotification } from "../../types/notification.type";

type ReadAdminNotificationResponse = {
    adminNotification: AdminNotification;
}

const readAdminNotification = (id: number) => 
    apiAxios<ReadAdminNotificationResponse>(`/api/admin-notifications/read/${id}`, {
        method: "PATCH",
    })

export default function useReadAdminNotification () {
    return useMutation({
        mutationFn: (id: number) => readAdminNotification(id),
    })
}