import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type {
    PaginationParams,
    PaginationResponse,
} from "../../types/pagination.type";
import type { StaffNotification } from "../../types/notification.type";

interface GetStaffNotificationsResponse extends PaginationResponse {
    staffNotifications: StaffNotification[];
    unread: number;
}

const getStaffNotifications = (params: PaginationParams) =>
    apiAxios<GetStaffNotificationsResponse>(
        "/api/staff-notifications",
        {
            method: "GET",
            params,
        }
    );

export default function useGetStaffNotifications(
    params: PaginationParams
) {
    return useQuery<GetStaffNotificationsResponse, Error>({
        queryKey: ["staff-notifications", params],
        queryFn: () => getStaffNotifications(params),
        refetchOnWindowFocus: false,
    });
}