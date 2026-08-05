import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { PatientNotification } from "../../types/notification.type";

interface GetPatientNotificationsResponse extends PaginationResponse {
    patientNotifications: PatientNotification[];
    unread: number;
} 


const getPatientNotifications = (params : PaginationParams) => 
    apiAxios<GetPatientNotificationsResponse>('/api/patient-notifications', {
        method: 'GET',
        params
    })

export default function useGetPatientNotifications (params : PaginationParams) {
    return useQuery<GetPatientNotificationsResponse, Error>({
        queryKey: ['patient-notifications', params],
        queryFn: () => getPatientNotifications(params),
        refetchOnWindowFocus: false
    })
}