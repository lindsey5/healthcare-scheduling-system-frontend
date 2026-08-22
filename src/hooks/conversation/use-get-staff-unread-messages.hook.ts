import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";

interface GetUnreadResponse {
    unread: number;
}

const getStaffUnreadMessages= (id: number) => 
    apiAxios<GetUnreadResponse>(`/api/conversations/unread/${id}`, {
        method: 'GET',
    })

export default function useGetStaffUnreadMessages (id: number) {
    return useQuery<GetUnreadResponse, Error>({
        queryKey: ['conversations/staff/unread', id],
        queryFn: () => getStaffUnreadMessages(id),
        refetchOnWindowFocus: false
    })
}