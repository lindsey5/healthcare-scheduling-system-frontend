import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Conversation } from "../../types/conversation.type";

interface GetConversationsResponse {
    conversations: Conversation[];
}

const getConversations = () => 
    apiAxios<GetConversationsResponse>('/api/conversations', {
        method: 'GET',
    })

export default function useGetConversations () {
    return useQuery<GetConversationsResponse, Error>({
        queryKey: ['conversations/patient'],
        queryFn: () => getConversations(),
        refetchOnWindowFocus: false
    })
}