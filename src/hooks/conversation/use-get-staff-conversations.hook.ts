import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Conversation } from "../../types/conversation.type";

interface GetStaffConversationsResponse  {
    conversations: Conversation[];
}

const getStaffConversations = () => 
    apiAxios<GetStaffConversationsResponse>(`/api/conversations/staff`, {
        method: 'GET',
    })

export default function useGetStaffConversations () {
    return useQuery<GetStaffConversationsResponse, Error>({
        queryKey: ['conversations/staff'],
        queryFn: () => getStaffConversations(),
        refetchOnWindowFocus: false
    })
}