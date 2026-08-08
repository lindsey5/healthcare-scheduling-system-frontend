import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

type ReadAllStaffNotificationsResponse = {
    message: string;
};

const readAllStaffNotifications = () =>
    apiAxios<ReadAllStaffNotificationsResponse>(
        "/api/staff-notifications/read",
        {
            method: "PATCH",
        }
    );

export default function useReadAllStaffNotifications() {
    return useMutation({
        mutationFn: () => readAllStaffNotifications(),
    });
}