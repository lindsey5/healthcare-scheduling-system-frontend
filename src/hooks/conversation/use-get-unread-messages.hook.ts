import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetUnreadResponse {
    unread: number;
}

const getPatientUnreadMessages= () => 
    apiAxios<GetUnreadResponse>('/api/conversations/unread', {
        method: 'GET',
    })

export default function useGetUnreadMessages () {
    return useQuery<GetUnreadResponse, Error>({
        queryKey: ['conversations/patient/unread'],
        queryFn: () => getPatientUnreadMessages(),
        refetchOnWindowFocus: false
    })
}