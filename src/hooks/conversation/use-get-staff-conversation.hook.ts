import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "../../api/apiAxios";
import type { PaginationParams, PaginationResponse } from "../../types/pagination.type";
import type { Conversation, Message } from "../../types/conversation.type";

interface GetStaffConversationResponse extends PaginationResponse {
    messages: Message[];
    conversation: Conversation;
}

const getStaffConversation = (params : PaginationParams) => 
    apiAxios<GetStaffConversationResponse>('/api/conversations/staff', {
        method: 'GET',
        params
    })

export default function useGetStaffConversation (params : PaginationParams) {
    return useQuery<GetStaffConversationResponse, Error>({
        queryKey: ['conversations/staff', params],
        queryFn: () => getStaffConversation(params),
        refetchOnWindowFocus: false
    })
}