import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { Conversation } from "../../types/conversation.type";
import type { PaginationParams } from "../../types/pagination.type";

interface GetConversationsResponse {
    conversations: Conversation[];
}

interface GetConversationsParams extends PaginationParams{
    search?: string;
}

const getConversations = (params: GetConversationsParams) => 
    apiAxios<GetConversationsResponse>('/api/conversations', {
        method: 'GET',
        params
    })

export default function useGetConversations (params: GetConversationsParams) {
    return useQuery<GetConversationsResponse, Error>({
        queryKey: ['conversations', params],
        queryFn: () => getConversations(params),
        refetchOnWindowFocus: false
    })
}