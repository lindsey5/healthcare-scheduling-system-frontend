import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { StaffNotification } from "../../types/notification.type";

type ReadStaffNotificationResponse = {
    staffNotification: StaffNotification;
};

const readStaffNotification = (id: number) =>
    apiAxios<ReadStaffNotificationResponse>(
        `/api/staff-notifications/read/${id}`,
        {
            method: "PATCH",
        }
    );

export default function useReadStaffNotification() {
    return useMutation({
        mutationFn: (id: number) => readStaffNotification(id),
    });
}