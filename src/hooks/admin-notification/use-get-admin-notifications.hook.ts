import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { AdminNotification } from "../../types/notification.type";

interface GetAdminNotificationsResponse extends PaginationResponse {
    adminNotifications: AdminNotification[];
    unread: number;
} 


const getAdminNotifications = (params : PaginationParams) => 
    apiAxios<GetAdminNotificationsResponse>('/api/admin-notifications', {
        method: 'GET',
        params
    })

export default function useGetAdminNotifications (params : PaginationParams) {
    return useQuery<GetAdminNotificationsResponse, Error>({
        queryKey: ['admin-notifications', params],
        queryFn: () => getAdminNotifications(params),
        refetchOnWindowFocus: false
    })
}